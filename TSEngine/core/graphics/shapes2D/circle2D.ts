namespace TSE {

    export class Circle2D implements IShape2D {

        public position: Vector2 = Vector2.zero;

        public radius: number;

        public setFromJson( json: any ): void {
            if ( json.position !== undefined ) {
                this.position.setFromJson( json.position );
            }

            if ( json.radius === undefined ) {
                throw new Error( "Rectangle2D requires radius to be present." );
            }
            this.radius = Number( json.radius );
        }

        public intersects( other: IShape2D ): boolean {

            if ( other instanceof Circle2D ) {
                let distance = Math.abs( Vector2.distance( other.position, this.position ) );
                let radiusLengths = this.radius + other.radius;
                if ( distance <= radiusLengths ) {
                    return true;
                }
            }

            if ( other instanceof Rectangle2D ) {
                if ( this.pointInShape( other.position ) ||
                    this.pointInShape( new Vector2( other.position.x + other.width, other.position.y ) ) ||
                    this.pointInShape( new Vector2( other.position.x + other.width, other.position.y + other.height ) ) ||
                    this.pointInShape( new Vector2( other.position.x, other.position.y + other.height ) ) ) {
                    return true;
                }
            }

            return false;
        }

        public pointInShape( point: Vector2 ): boolean {

            let absDistance = Math.abs( Vector2.distance( this.position, point ) );
            if ( absDistance <= this.radius ) {
                return true;
            }

            return false;
        }
    }
}