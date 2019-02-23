namespace NT {

    /**
     * The basis from which all objects should be inherited. TObjects are each given
     * a unique identifier which can be used to identify the object for debugging purposes.
     * Objects ultimately inheriting from TObject should be prefixed with a T to denote this.
     */
    export abstract class TObject {

        // The global object id, which is incremented every time a new TObject is created.
        private static _GLOBAL_OBJECT_ID: number = 0;

        private _id: number;

        /** Creates a new TObject. */
        public constructor() {
            this._id = TObject._GLOBAL_OBJECT_ID++;
        }

        /** Returns the unique identifier for this object. */
        public get ID(): number {
            return this._id;
        }

        public destroy(): void {
            this._id = undefined;

            // NOTE: If this is ever added to a tracking system, it should be untracked here.
        }
    }
}