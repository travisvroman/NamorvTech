namespace NT {

    /**
     * Represents the transformation of an object, providing position, rotation and scale.
     */
    export class Transform {

        /** The position. Default: Vector3.zero */
        public position: Vector3 = Vector3.zero;

        /** The rotation. Default: Vector3.zero */
        public rotation: Vector3 = Vector3.zero;

        /** The rotation. Default: Vector3.one */
        public scale: Vector3 = Vector3.one;

        /**
         * Creates a copy of the provided transform.
         * @param transform The transform to be copied.
         */
        public copyFrom( transform: Transform ): void {
            this.position.copyFrom( transform.position );
            this.rotation.copyFrom( transform.rotation );
            this.scale.copyFrom( transform.scale );
        }

        /** Creates and returns a matrix based on this transform. */
        public getTransformationMatrix(): Matrix4x4 {
            let translation = Matrix4x4.translation( this.position );

            let rotation = Matrix4x4.rotationXYZ( this.rotation.x, this.rotation.y, this.rotation.z );
            let scale = Matrix4x4.scale( this.scale );

            // T * R * S
            return Matrix4x4.multiply( Matrix4x4.multiply( translation, rotation ), scale );
        }

        /**
         * Sets the values of this transform to the ones provided in the given JSON.
         * Only values which are overridden need be provided. For example, a position of [0,1,0] 
         * needs only to provide the y value (1) as 0 is the default for x and z.
         * @param json The JSON to set from.
         */
        public setFromJson( json: any ): void {
            if ( json.position !== undefined ) {
                this.position.setFromJson( json.position );
            }

            if ( json.rotation !== undefined ) {
                this.rotation.setFromJson( json.rotation );
            }

            if ( json.scale !== undefined ) {
                this.scale.setFromJson( json.scale );
            }
        }
    }
}