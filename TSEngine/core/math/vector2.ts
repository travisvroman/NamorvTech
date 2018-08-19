
namespace TSE {

    /** Represents a 2-component vector. */
    export class Vector2 {

        private _x: number;
        private _y: number;

        /**
         * Creates a new vector 2.
         * @param x The x component.
         * @param y The y component.
         */
        public constructor( x: number = 0, y: number = 0 ) {
            this._x = x;
            this._y = y;
        }

        /** The x component. */
        public get x(): number {
            return this._x;
        }

        /** The x component. */
        public set x( value: number ) {
            this._x = value;
        }

        /** The y component. */
        public get y(): number {
            return this._y;
        }

        /** The y component. */
        public set y( value: number ) {
            this._y = value;
        }

        /** Returns the data of this vector as a number array. */
        public toArray(): number[] {
            return [this._x, this._y];
        }

        /** Returns the data of this vector as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this.toArray() );
        }
    }
}