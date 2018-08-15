namespace TSE {

    /** A 4x4 matrix to be used for transformations. */
    export class Matrix4x4 {

        private _data: number[] = [];

        /** Creates a new matrix 4x4. Marked as private to enforce the use of static methods. */
        private constructor() {
            this._data = [
                1.0, 0, 0, 0,
                0, 1.0, 0, 0,
                0, 0, 1.0, 0,
                0, 0, 0, 1.0
            ];
        }

        /** Returns the data contained in this matrix as an array of numbers. */
        public get data(): number[] {
            return this._data;
        }

        /** Creates and returns an identity matrix. */
        public static identity(): Matrix4x4 {
            return new Matrix4x4();
        }

        /**
         * Creates and returns a new orthographic projection matrix.
         * @param left The left extents of the viewport.
         * @param right The right extents of the viewport.
         * @param bottom The bottom extents of the viewport.
         * @param top The top extents of the viewport.
         * @param nearClip The near clipping plane.
         * @param farClip The far clipping plane.
         */
        public static orthographic( left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number ): Matrix4x4 {
            let m = new Matrix4x4();

            let lr: number = 1.0 / ( left - right );
            let bt: number = 1.0 / ( bottom - top );
            let nf: number = 1.0 / ( nearClip - farClip );

            m._data[0] = -2.0 * lr;

            m._data[5] = -2.0 * bt;

            m._data[10] = 2.0 * nf;

            m._data[12] = ( left + right ) * lr;
            m._data[13] = ( top + bottom ) * bt;
            m._data[14] = ( farClip + nearClip ) * nf;

            return m;
        }

        /**
         * Creates a transformation matrix using the provided position.
         * @param position The position to be used in transformation.
         */
        public static translation( position: Vector3 ): Matrix4x4 {
            let m = new Matrix4x4();

            m._data[12] = position.x;
            m._data[13] = position.y;
            m._data[14] = position.z;

            return m;
        }
        
        /** Returns the data of this matrix as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this._data );
        }
    }
}