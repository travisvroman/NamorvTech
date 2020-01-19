namespace NT {

    /**
     * Manages levels in the engine. Levels (for now) are registered with this manager
     * so that they may be loaded on demand. Register a level name
     * with a file path and load the level configurations dynamically.
     */
    export class LevelManager {

        private static _registeredLevels: { [name: string]: string } = {};
        private static _activeLevel: Level;
        private static _configLoaded: boolean = false;

        /** Private constructor to enforce singleton pattern. */
        private constructor() {
        }

        /** Indicates if this manager is loaded. */
        public static get isLoaded(): boolean {
            return LevelManager._configLoaded;
        }

        /** Gets the active level. */
        public static get activeLevel(): Level {
            return LevelManager._activeLevel;
        }

        /** Loads this manager. */
        public static load(): void {

            // Get the asset(s). TODO: This probably should come from a central asset manifest.
            let asset = AssetManager.getAsset( "assets/levels/levels.json" );
            if ( asset !== undefined ) {
                LevelManager.processLevelConfigAsset( asset as JsonAsset );
            } else {

                // Listen for the asset load.
                Message.subscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json",
                    LevelManager.onMessage );
            }
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
            if ( LevelManager._registeredLevels[name] !== undefined ) {

                // If the level asset is already loaded, get it and use it to load the level.
                // Otherwise, retrieve the asset and load the level upon completion.
                if ( AssetManager.isAssetLoaded( LevelManager._registeredLevels[name] ) ) {
                    let asset = AssetManager.getAsset( LevelManager._registeredLevels[name] );
                    LevelManager.loadLevel( asset );
                } else {
                    Message.subscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + LevelManager._registeredLevels[name], LevelManager.onMessage );
                    AssetManager.loadAsset( LevelManager._registeredLevels[name] );
                }
            } else {
                throw new Error( "Level named:" + name + " is not registered." );
            }
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public static onMessage( message: Message ): void {

            // TODO: one for each asset.
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json" ) {
                Message.unsubscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/levels/levels.json",
                    LevelManager.onMessage );

                LevelManager.processLevelConfigAsset( message.context as JsonAsset );
            } else if ( message.code.indexOf( MESSAGE_ASSET_LOADER_ASSET_LOADED ) !== -1 ) {
                console.log( "Level loaded:" + message.code );
                let asset = message.context as JsonAsset;
                LevelManager.loadLevel( asset );
            }
        }

        private static loadLevel( asset: JsonAsset ): void {
            console.log( "Loading level:" + asset.Name );
            let data = asset.Data;

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


            Message.send( "LEVEL_LOADED", this );
        }

        private static processLevelConfigAsset( asset: JsonAsset ): void {

            let levels = asset.Data.levels;
            if ( levels ) {
                for ( let level of levels ) {
                    if ( level.name !== undefined && level.file !== undefined ) {
                        LevelManager._registeredLevels[level.name] = String( level.file );
                    } else {
                        throw new Error( "Invalid level config file format: name or file is missing" );
                    }
                }
            }

            // TODO: Should only set this if ALL queued assets have loaded.
            LevelManager._configLoaded = true;
        }
    }
}