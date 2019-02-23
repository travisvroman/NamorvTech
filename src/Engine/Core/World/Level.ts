namespace NT {

    /**
     * Represents the basic level state.
     */
    export enum LevelState {

        /** The level is not yet initialized. */
        UNINITIALIZED,

        /** The level is currently loading. */
        LOADING,

        /** The level is loaded and is currently updating. */
        UPDATING
    }


    /**
     * Represents a single level in the world. Levels are loaded and unloaded as the player 
     * progresses through the game. An open world would be achieved by overriding this class
     * and adding/removing objects dynamically based on player position, etc.
     */
    export class Level {

        private _name: string;
        private _description: string;
        private _sceneGraph: SceneGraph;
        private _state: LevelState = LevelState.UNINITIALIZED;

        /**
         * Creates a new level.
         * @param name The name of this level.
         * @param description A brief description of this level. 
         * Could be used on level selection screens for some games.
         */
        public constructor( name: string, description: string ) {
            this._name = name;
            this._description = description;
            this._sceneGraph = new SceneGraph();
        }

        /** The name of this level. */
        public get name(): string {
            return this._name;
        }

        /** The description of this level. */
        public get description(): string {
            return this._description;
        }

        /** The SceneGraph of this level. */
        public get sceneGraph(): SceneGraph {
            return this._sceneGraph;
        }

        /**
         * Performs initialization routines on this level.
         * @param jsonData The JSON-formatted data to initialize this level with.
         */
        public initialize( jsonData: any ): void {
            if ( jsonData.objects === undefined ) {
                throw new Error( "Zone initialization error: objects not present." );
            }

            for ( let o in jsonData.objects ) {
                let obj = jsonData.objects[o];

                this.loadEntity( obj, this._sceneGraph.root );
            }
        }

        /** Loads this level. */
        public load(): void {
            this._state = LevelState.LOADING;

            this._sceneGraph.load();
            this._sceneGraph.root.updateReady();

            this._state = LevelState.UPDATING;
        }

        /** Unloads this level. */
        public unload(): void {

        }

        /**
         * Updates this level.
         * @param time The delta time in milliseconds since the last update.
         */
        public update( time: number ): void {
            if ( this._state === LevelState.UPDATING ) {
                this._sceneGraph.update( time );
            }
        }

        /**
         * Renders this level.
         * @param shader The shader to use when rendering.
         */
        public render( shader: Shader ): void {
            if ( this._state === LevelState.UPDATING ) {
                this._sceneGraph.render( shader );
            }
        }

        /** Called when this level is activated. */
        public onActivated(): void {
        }

        /** Called when this level is deactivated. */
        public onDeactivated(): void {
        }

        /**
         * Loads an ertity using the data section provided. Attaches to the provided parent.
         * @param dataSection The data section to load from.
         * @param parent The parent object to attach to.
         */
        private loadEntity( dataSection: any, parent: TEntity ): void {

            let name: string;
            if ( dataSection.name !== undefined ) {
                name = String( dataSection.name );
            }

            let entity = new TEntity( name, this._sceneGraph );

            if ( dataSection.transform !== undefined ) {
                entity.transform.setFromJson( dataSection.transform );
            }

            if ( dataSection.components !== undefined ) {
                for ( let c in dataSection.components ) {
                    let data = dataSection.components[c];
                    let component = ComponentManager.extractComponent( data );
                    entity.addComponent( component );
                }
            }

            if ( dataSection.behaviors !== undefined ) {
                for ( let b in dataSection.behaviors ) {
                    let data = dataSection.behaviors[b];
                    let behavior = BehaviorManager.extractBehavior( data );
                    entity.addBehavior( behavior );
                }
            }

            if ( dataSection.children !== undefined ) {
                for ( let o in dataSection.children ) {
                    let obj = dataSection.children[o];
                    this.loadEntity( obj, entity );
                }
            }

            if ( parent !== undefined ) {
                parent.addChild( entity );
            }
        }
    }
}