namespace NT {

    /**
     * Components are renderable objects which are attached to TEntities in the world.
     * These components inherit the transforms of the object to which they are attached.
     */
    export interface IComponent {

        /**
         * The name of this component.
         */
        name: string;

        /** The owning entity. */
        readonly owner: TEntity;

        /**
         * Sets the owner of this component.
         * @param owner The owner to be set.
         */
        setOwner( owner: TEntity ): void;

        /** Performs pre-update procedures on this component. */
        updateReady(): void;

        /** Loads this component. */
        load(): void;

        /**
         * Updates this component.
         * @param time The amount of time in milliseconds since the last update.
         */
        update( time: number ): void;

        /**
         * Renders this component.
         */
        render( renderView: RenderView ): void;
    }
}