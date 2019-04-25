namespace NT {

    /**
     * A scene graph, which is responsible for managing the heirarchy of objects in a scene (essentially,
     * it is the scene itself).
     */
    export class SceneGraph {

        private _root: TEntity;

        /** Creates a new SceneGraph */
        public constructor() {
            this._root = new TEntity( "__ROOT__", this );
        }

        /** Returns the root object. */
        public get root(): TEntity {
            return this._root;
        }

        /** Indicates if this scene is loaded. */
        public get isLoaded(): boolean {
            return this._root.isLoaded;
        }

        /**
         * Adds an entity to the root entity of this scene graph.
         * @param entity The entity to be added.
         */
        public addObject( entity: TEntity ): void {
            this._root.addChild( entity );
        }

        /**
         * Recursively searches this scene graph for an entity with the provided name.
         * @param name The name of the entity to retrieve.
         */
        public getEntityByName( name: string ): TEntity {
            return this._root.getEntityByName( name );
        }

        /** Loads this scene graph. */
        public load(): void {
            this._root.load();
        }

        /**
         * Performs update procedures on this scene graph.
         * @param time The delta time in milliseconds since the last update.
         */
        public update( time: number ): void {
            this._root.update( time );
        }

        /**
         * Renders this scene graph.
         */
        public render( renderView: RenderView ): void {
            this._root.render( renderView );
        }
    }
}