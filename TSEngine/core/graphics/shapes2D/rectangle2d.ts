namespace TSE {

    export class Rectangle2D implements IShape2D {

        public position: Vector2 = Vector2.zero;

        public origin: Vector2 = new Vector2( 0.5, 0.5 );

        public width: number;

        public height: number;

        public get offset(): Vector2 {
            return new Vector2( -( this.width * this.origin.x ), -( this.height * this.origin.y ) );
        }

        public setFromJson( json: any ): void {
            if ( json.position !== undefined ) {
                this.position.setFromJson( json.position );
            }

            if ( json.origin !== undefined ) {
                this.origin.setFromJson( json.origin );
            }

            if ( json.width === undefined ) {
                throw new Error( "Rectangle2D requires width to be present." );
            }
            this.width = Number( json.width );

            if ( json.height === undefined ) {
                throw new Error( "Rectangle2D requires height to be present." );
            }
            this.height = Number( json.height );
        }

        public intersects( other: IShape2D ): boolean {
            if ( other instanceof Rectangle2D ) {

                if ( this.pointInShape( other.position ) ||
                    this.pointInShape( new Vector2( other.position.x + other.width, other.position.y ) ) ||
                    this.pointInShape( new Vector2( other.position.x + other.width, other.position.y + other.height ) ) ||
                    this.pointInShape( new Vector2( other.position.x, other.position.y + other.height ) ) ) {
                    return true;
                }
            }

            if ( other instanceof Circle2D ) {
                let deltaX = other.position.x - Math.max( this.position.x, Math.min( other.position.x, this.position.x + this.width ) );
                let deltaY = other.position.y - Math.max( this.position.y, Math.min( other.position.y, this.position.y + this.height ) );
                if ( ( deltaX * deltaX + deltaY * deltaY ) < ( other.radius * other.radius ) ) {
                    return true;
                }
            }

            return false;
        }

        public pointInShape( point: Vector2 ): boolean {
            if ( point.x >= this.position.x && point.x <= this.position.x + this.width ) {
                if ( point.y >= this.position.y && point.y <= this.position.y + this.height ) {
                    return true;
                }
            }

            return false;
        }
    }
}