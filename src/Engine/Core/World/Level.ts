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
        private _registeredCameras: Dictionary<BaseCamera> = {};
        private _activeCamera: BaseCamera;
        private _defaultCameraName: string;

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

        /** The currently active camera. */
        public get activeCamera(): BaseCamera {
            return this._activeCamera;
        }

        /** Indicates if this level is loaded. */
        public get isLoaded(): boolean {
            return this._state === LevelState.UPDATING;
        }

        /**
         * Performs initialization routines on this level.
         * @param jsonData The JSON-formatted data to initialize this level with.
         */
        public initialize( jsonData: any ): void {
            if ( jsonData.objects === undefined ) {
                throw new Error( "Zone initialization error: objects not present." );
            }

            if ( jsonData.defaultCamera !== undefined ) {
                this._defaultCameraName = String( jsonData.defaultCamera );
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

            // Get registered cameras. If there aren't any, register one automatically.
            // Otherwise, look for the first one and make it active.
            // TODO: Add active camera to level config, assign by name.
            if ( this._defaultCameraName !== undefined ) {
                let obj = this._sceneGraph.getEntityByName( this._defaultCameraName );
                if ( obj === undefined ) {
                    throw new Error( "Default camera not found:" + this._defaultCameraName );
                } else {
                    // NOTE: If detected, the camera should already be registered at this point.
                }
            } else {
                let cameraKeys = Object.keys( this._registeredCameras );
                if ( cameraKeys.length > 0 ) {
                    this._activeCamera = this._registeredCameras[cameraKeys[0]];
                } else {
                    let defaultCamera = new PerspectiveCamera( "DEFAULT_CAMERA", this._sceneGraph );
                    this._sceneGraph.addObject( defaultCamera );
                    this.registerCamera( defaultCamera );
                    this._activeCamera = defaultCamera;
                }
            }

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
         */
        public render( renderView: RenderView ): void {
            if ( this._state === LevelState.UPDATING ) {
                this._sceneGraph.render( renderView );
            }
        }

        /** Called when this level is activated. */
        public onActivated(): void {
        }

        /** Called when this level is deactivated. */
        public onDeactivated(): void {
        }

        /**
         * Registers the provided camera with this level. Automatically sets as the active camera
         * if no active camera is currently set.
         * @param camera The camera to register.
         */
        public registerCamera( camera: BaseCamera ): void {
            if ( this._registeredCameras[camera.name] === undefined ) {
                this._registeredCameras[camera.name] = camera;
                if ( this._activeCamera === undefined ) {
                    this._activeCamera = camera;
                }
            } else {
                console.warn( "A camera named '" + camera.name + "' has already been registered. New camera not registered." );
            }
        }

        /**
         * Unregisters the provided camera with this level.
         * @param camera The camera to unregister.
         */
        public unregisterCamera( camera: BaseCamera ): void {
            if ( this._registeredCameras[camera.name] !== undefined ) {
                this._registeredCameras[camera.name] = undefined;
                if ( this._activeCamera === camera ) {

                    // NOTE: auto-activate the next camera in line?
                    this._activeCamera = undefined;
                }
            } else {
                console.warn( "No camera named '" + camera.name + "' hsd been registered. Camera not unregistered." );
            }
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

            let entity: TEntity;

            // TODO: Use factories
            if ( dataSection.type !== undefined ) {
                if ( dataSection.type = "perspectiveCamera" ) {
                    entity = new PerspectiveCamera( name, this._sceneGraph );
                    this.registerCamera( entity as BaseCamera );
                } else {
                    throw new Error( "Unsupported type " + dataSection.type );
                }
            } else {
                entity = new TEntity( name, this._sceneGraph );
            }


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