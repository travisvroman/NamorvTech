
namespace NT {

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

        /** Returns a vector2 with all components set to 0. */
        public static get zero(): Vector2 {
            return new Vector2();
        }

        /** Returns a vector2 with all components set to 1. */
        public static get one(): Vector2 {
            return new Vector2( 1, 1 );
        }

        /**
         * Calculates the difference between vector a and vector b.
         * @param a The first vector.
         * @param b The second vector.
         */
        public static distance( a: Vector2, b: Vector2 ): number {
            let diff = a.clone().subtract( b );
            return Math.sqrt( diff.x * diff.x + diff.y * diff.y );
        }

        /**
         * Copies the contents of the provided vector to this vector.
         * @param v The vector to copy from.
         */
        public copyFrom( v: Vector2 ): void {
            this._x = v._x;
            this._y = v._y;
        }

        /** Returns the data of this vector as a number array. */
        public toArray(): number[] {
            return [this._x, this._y];
        }

        /** Returns the data of this vector as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this.toArray() );
        }

        /** Converts this vector2 to a vector3, with the z component set to 0. */
        public toVector3(): Vector3 {
            return new Vector3( this._x, this._y, 0 );
        }

        /**
         * Sets the x and y values of this vector.
         * @param x The x value. Optional.
         * @param y The y value. Optional.
         */
        public set( x?: number, y?: number ): void {
            if ( x !== undefined ) {
                this._x = x;
            }

            if ( y !== undefined ) {
                this._y = y;
            }
        }

        /**
         * Sets the values of this vector from the provided JSON.
         * @param json The JSON to set from.
         */
        public setFromJson( json: any ): void {
            if ( json.x !== undefined ) {
                this._x = Number( json.x );
            }

            if ( json.y !== undefined ) {
                this._y = Number( json.y );
            }
        }

        /**
         * Adds the provided vector to this vector.
         * @param v The vector to be added.
         */
        public add( v: Vector2 ): Vector2 {
            this._x += v._x;
            this._y += v._y;

            return this;
        }

        /**
         * Subtracts the provided vector from this vector.
         * @param v The vector to be subtracted.
         */
        public subtract( v: Vector2 ): Vector2 {
            this._x -= v._x;
            this._y -= v._y;

            return this;
        }

        /**
         * Multiplies this vector by the provided vector.
         * @param v The vector to be multiplied by.
         */
        public multiply( v: Vector2 ): Vector2 {
            this._x *= v._x;
            this._y *= v._y;

            return this;
        }

        /**
         * Divides this vector by the provided vector.
         * @param v The vector to be divided by.
         */
        public divide( v: Vector2 ): Vector2 {
            this._x /= v._x;
            this._y /= v._y;

            return this;
        }

        /**
         * Scales this vector by the provided number.
         */
        public scale( scale: number ): Vector2 {
            this._x *= scale;
            this._y *= scale;

            return this;
        }

        /** Clones this vector. */
        public clone(): Vector2 {
            return new Vector2( this._x, this._y );
        }
    }
}