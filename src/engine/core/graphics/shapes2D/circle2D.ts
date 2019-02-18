namespace NT {

    /** Represents a 2D circle. */
    export class Circle2D implements IShape2D {

        /** The position of this shape. */
        public position: Vector2 = Vector2.zero;

        /** The origin of this shape. */
        public origin: Vector2 = Vector2.zero;

        /** The redius of this circle. */
        public radius: number;

        /** The offset of this shape. */
        public get offset(): Vector2 {
            return new Vector2( this.radius + ( this.radius * this.origin.x ), this.radius + ( this.radius * this.origin.y ) );
        }

        /**
         * Sets the properties of this shape from the provided json.
         * @param json The json to set from.
         */
        public setFromJson( json: any ): void {
            if ( json.position !== undefined ) {
                this.position.setFromJson( json.position );
            }

            if ( json.origin !== undefined ) {
                this.origin.setFromJson( json.origin );
            }

            if ( json.radius === undefined ) {
                throw new Error( "Rectangle2D requires radius to be present." );
            }
            this.radius = Number( json.radius );
        }

        /**
         * Indicates if this shape intersects the other shape.
         * @param other The other shape to check.
         */
        public intersects( other: IShape2D ): boolean {

            if ( other instanceof Circle2D ) {
                let distance = Math.abs( Vector2.distance( other.position, this.position ) );
                let radiusLengths = this.radius + other.radius;
                if ( distance <= radiusLengths ) {
                    return true;
                }
            }

            if ( other instanceof Rectangle2D ) {
                let deltaX = this.position.x - Math.max( other.position.x, Math.min( this.position.x, other.position.x + other.width ) );
                let deltaY = this.position.y - Math.max( other.position.y, Math.min( this.position.y, other.position.y + other.height ) );
                if ( ( deltaX * deltaX + deltaY * deltaY ) < ( this.radius * this.radius ) ) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Indicates if the provided point is contained within this shape.
         * @param point The point to check.
         */
        public pointInShape( point: Vector2 ): boolean {

            let absDistance = Math.abs( Vector2.distance( this.position, point ) );
            if ( absDistance <= this.radius ) {
                return true;
            }

            return false;
        }
    }
}