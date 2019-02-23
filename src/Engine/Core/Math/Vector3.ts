
namespace NT {

    /** Represents a 3-component vector. */
    export class Vector3 {

        private _x: number;
        private _y: number;
        private _z: number;

        /**
         * Creates a new vector 3.
         * @param x The x component.
         * @param y The y component.
         * @param z The z component.
         */
        public constructor( x: number = 0, y: number = 0, z: number = 0 ) {
            this._x = x;
            this._y = y;
            this._z = z;
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

        /** The z component. */
        public get z(): number {
            return this._z;
        }

        /** The z component. */
        public set z( value: number ) {
            this._z = value;
        }

        /** Returns a vector3 with all components set to 0. */
        public static get zero(): Vector3 {
            return new Vector3();
        }

        /** Returns a vector3 with all components set to 1. */
        public static get one(): Vector3 {
            return new Vector3( 1, 1, 1 );
        }

        /**
         * Calculates the difference between vector a and vector b.
         * @param a The first vector.
         * @param b The second vector.
         */
        public static distance( a: Vector3, b: Vector3 ): number {
            let diff = a.subtract( b );
            return Math.sqrt( diff.x * diff.x + diff.y * diff.y + diff.z * diff.z );
        }

        /**
         * Sets the x, y and z components of this vector.
         * @param x The x component value.
         * @param y The y component value.
         * @param z The z component value.
         */
        public set( x?: number, y?: number, z?: number ): void {
            if ( x !== undefined ) {
                this._x = x;
            }

            if ( y !== undefined ) {
                this._y = y;
            }

            if ( z !== undefined ) {
                this._z = z;
            }
        }

        /**
         * Check if this vector is equal to the one passed in.
         * @param v The vector to check against.
         */
        public equals( v: Vector3 ): boolean {
            return ( this.x === v.x && this.y === v.y && this.z === v.z );
        }

        /** Returns the data of this vector as a number array. */
        public toArray(): number[] {
            return [this._x, this._y, this._z];
        }

        /** Returns the data of this vector as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this.toArray() );
        }

        /** Converts this vector to a Vector2 by dropping the Z component. */
        public toVector2(): Vector2 {
            return new Vector2( this._x, this._y );
        }

        /**
         * Copies the contents of the provided vector to this vector.
         * @param vector The vector to be copied.
         */
        public copyFrom( vector: Vector3 ): void {
            this._x = vector._x;
            this._y = vector._y;
            this._z = vector._z;
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

            if ( json.z !== undefined ) {
                this._z = Number( json.z );
            }
        }

        /**
         * Adds the provided vector to this vector.
         * @param v The vector to be added.
         */
        public add( v: Vector3 ): Vector3 {
            this._x += v._x;
            this._y += v._y;
            this._z += v._z;

            return this;
        }

        /**
         * Subtracts the provided vector from this vector.
         * @param v The vector to be subtracted.
         */
        public subtract( v: Vector3 ): Vector3 {
            this._x -= v._x;
            this._y -= v._y;
            this._z -= v._z;

            return this;
        }

        /**
         * Multiplies this vector by the provided vector.
         * @param v The vector to be multiplied by.
         */
        public multiply( v: Vector3 ): Vector3 {
            this._x *= v._x;
            this._y *= v._y;
            this._z *= v._z;

            return this;
        }

        /**
         * Divides this vector by the provided vector.
         * @param v The vector to be divided by.
         */
        public divide( v: Vector3 ): Vector3 {
            this._x /= v._x;
            this._y /= v._y;
            this._z /= v._z;

            return this;
        }

        /**
         * Scales this vector by the provided number.
         */
        public scale( scale: number ): Vector3 {
            this._x *= scale;
            this._y *= scale;
            this._z *= scale;

            return this;
        }

        /** Clones this vector. */
        public clone(): Vector3 {
            return new Vector3( this._x, this._y, this._z );
        }
    }
}