namespace NT {

    /**
     * Manages levels in the engine. Levels (for now) are registered with this manager
     * so that they may be loaded on demand. Register a level name
     * with a file path and load the level configurations dynamically.
     */
    export class LevelManager implements IMessageHandler {

        private static _registeredZones: { [name: string]: string } = {};
        private static _activeLevel: Level;
        private static _inst: LevelManager;

        /** Private constructor to enforce singleton pattern. */
        private constructor() {
        }

        /** Initializes this manager. */
        public static initialize(): void {
            LevelManager._inst = new LevelManager();


            // TODO: TEMPORARY
            LevelManager._registeredZones["test"] = "assets/zones/testZone.json";
        }

        /**
         * Changes the active level to the one with the provided name.
         * @param name The name of the level to change to.
         */
        public static changeLevel( name: string ): void {
            if ( LevelManager._activeLevel !== undefined ) {
                LevelManager._activeLevel.onDeactivated();
                LevelManager._activeLevel.unload();
                LevelManager._activeLevel = undefined;
            }

            // Make sure the level is registered.
            if ( LevelManager._registeredZones[name] !== undefined ) {

                // If the level asset is already loaded, get it and use it to load the level.
                // Otherwise, retrieve the asset and load the level upon completion.
                if ( AssetManager.isAssetLoaded( LevelManager._registeredZones[name] ) ) {
                    let asset = AssetManager.getAsset( LevelManager._registeredZones[name] );
                    LevelManager.loadLevel( asset );
                } else {
                    Message.subscribe( MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredZones[name], LevelManager._inst );
                    AssetManager.loadAsset( LevelManager._registeredZones[name] );
                }
            } else {
                throw new Error( "Zone named:" + name + " is not registered." );
            }
        }

        /**
         * Updates this manager.
         * @param time The delta time in milliseconds since the last update.
         */
        public static update( time: number ): void {
            if ( LevelManager._activeLevel !== undefined ) {
                LevelManager._activeLevel.update( time );
            }
        }

        /**
         * Renders the level with the provided shader.
         * @param shader The shader to render with.
         */
        public static render( shader: Shader ): void {
            if ( LevelManager._activeLevel !== undefined ) {
                LevelManager._activeLevel.render( shader );
            }
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public onMessage( message: Message ): void {
            if ( message.code.indexOf( MESSAGE_ASSET_LOADER_ASSET_LOADED ) !== -1 ) {
                console.log( "Level loaded:" + message.code );
                let asset = message.context as JsonAsset;
                LevelManager.loadLevel( asset );
            }
        }

        private static loadLevel( asset: JsonAsset ): void {
            console.log( "Loading level:" + asset.name );
            let data = asset.data;

            let levelName: string;
            if ( data.name === undefined ) {
                throw new Error( "Zone file format exception: Zone name not present." );
            } else {
                levelName = String( data.name );
            }

            let description: string;
            if ( data.description !== undefined ) {
                description = String( data.description );
            }

            LevelManager._activeLevel = new Level( levelName, description );
            LevelManager._activeLevel.initialize( data );
            LevelManager._activeLevel.onActivated();
            LevelManager._activeLevel.load();

            
            Message.send( "GAME_READY", this );
        }
    }
}