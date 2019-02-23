namespace NT {

    /**
     * The base behavior type from which all behaviors should inherit.
     * This class cannot be instatiated directly.
     */
    export abstract class BaseBehavior implements IBehavior {
        public name: string;

        /**
         * The data associated with this behavior.
         */
        protected _data: IBehaviorData;

        /**
         * The owning entity of this behavior.
         */
        protected _owner: TEntity;

        /**
         * Creates a new base behavior.
         * @param data The data to be used when creating this object.
         */
        public constructor( data: IBehaviorData ) {
            this._data = data;
            this.name = this._data.name;
        }

        /**
         * Sets the owner entity.
         * @param owner The owner.
         */
        public setOwner( owner: TEntity ): void {
            this._owner = owner;
        }

        /**
         * Performs pre-update procedures on this behavior.
         */
        public updateReady(): void {
        }

        /**
         * Performs update procedures on this behavior.
         * @param time The delta time in milliseconds since the last update.
         */
        public update( time: number ): void {
        }

        /**
         * Applys this behavior with the given user data.
         * @param userData The user data to be applied.
         */
        public apply( userData: any ): void {
        }
    }
}