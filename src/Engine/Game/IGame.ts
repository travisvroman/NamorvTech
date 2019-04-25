
namespace NT {

    /** 
     * An interface which represents an object that holds game-specific information. 
     * Used for loading the first/initial level, etc. Each game should implement 
     * their own class for this.
     */
    export interface IGame {

        /** 
         * Called before the main update loop, after updateReady has been called on the engine subsystems. 
         * Used for loading the first/initial level, etc.
         */
        UpdateReady(): void;

        /**
         * Performs update procedures on this game. Called after all engine subsystems have updated.
         * @param time The delta time in milliseconds since the last update.
         */
        Update( time: number ): void;

        /**
         * Renders this game. Called after all engine subsystems have rendered.
         * @param time The delta time in milliseconds since the last frame.
         * @param renderView The view of information used for this render pass.
         */
        Render( time: number, renderView: RenderView ): void;
    }
}