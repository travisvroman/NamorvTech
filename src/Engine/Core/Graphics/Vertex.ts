namespace NT {

    /**
     * Represents the data for a single vertex. A vertex is a single point in space which holds
     * positional and normal data as well as texture coordinates.
     * */
    export class Vertex {

        /** The position of this vertex. */
        public position: Vector3 = Vector3.zero;

        /** The texture coordinates of this vertex. */
        public texCoords: Vector2 = Vector2.zero;

        /**
         * Creates a new vertex.
         * @param x The x position.
         * @param y The y position.
         * @param z The z position.
         * @param tu The texture u coordinate.
         * @param tv The texture v coordinate.
         */
        public constructor( x: number = 0, y: number = 0, z: number = 0, tu: number = 0, tv: number = 0 ) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;

            this.texCoords.x = tu;
            this.texCoords.y = tv;
        }

        /** Returns the data of this vertex as an array of numbers. */
        public toArray(): number[] {
            let array: number[] = [];

            array = array.concat( this.position.toArray() );
            array = array.concat( this.texCoords.toArray() );

            return array;
        }

        /** Returns the data of this vertex as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this.toArray() );
        }
    }
}