namespace NT {

    /**
     * Represents a 2-dimensional sprite which is drawn on the screen.
     * */
    export class Sprite {

        protected _name: string;
        protected _width: number;
        protected _height: number;
        protected _origin: Vector3 = Vector3.zero;

        protected _buffer: GLBuffer;
        protected _materialName: string;
        protected _material: Material;
        protected _vertices: Vertex[] = [];

        /**
         * Creates a new sprite.
         * @param name The name of this sprite.
         * @param materialName The name of the material to use with this sprite.
         * @param width The width of this sprite.
         * @param height The height of this sprite.
         */
        public constructor( name: string, materialName: string, width: number = 100, height: number = 100 ) {
            this._name = name;
            this._width = width;
            this._height = height;
            this._materialName = materialName;
            this._material = MaterialManager.getMaterial( this._materialName );
        }

        /** The name of this sprite. */
        public get name(): string {
            return this._name;
        }

        /** The origin location of this sprite. */
        public get origin(): Vector3 {
            return this._origin;
        }

        /** The name of this sprite. */
        public set origin( value: Vector3 ) {
            this._origin = value;
            this.recalculateVertices();
        }

        /** The width of this sprite. */
        public get width(): number {
            return this._width;
        }

        /** The height of this sprite. */
        public get height(): number {
            return this._height;
        }

        /** Performs destruction routines on this sprite. */
        public destroy(): void {
            if ( this._buffer ) {
                this._buffer.destroy();
            }
            if ( this._material ) {
                MaterialManager.releaseMaterial( this._materialName );
                this._material = undefined;
                this._materialName = undefined;
            }
        }

        /**
         * Performs loading routines on this sprite.
         * */
        public load(): void {
            this._buffer = new GLBuffer();

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation( positionAttribute );

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.size = 2;
            this._buffer.addAttributeLocation( texCoordAttribute );

            this.calculateVertices();
        }

        /**
         * Performs update routines on this sprite.
         * @param time The delta time in milliseconds since the last update call.
         */
        public update( time: number ): void {

        }

        /**
         * Draws this sprite.
         * @param model The model transformation matrix.
         */
        public draw( model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4 ): void {

            this._material.Apply( model, view, projection );

            this._buffer.bind();
            this._buffer.draw();
        }

        /** Calculates the vertices for this sprite. */
        protected calculateVertices(): void {
            let minX = -( this._width * this._origin.x );
            let maxX = this._width * ( 1.0 - this._origin.x );

            let minY = -( this._height * this._origin.y );
            let maxY = this._height * ( 1.0 - this._origin.y );

            this._vertices = [

                // x,y,z   ,u, v
                new Vertex( minX, minY, 0, 0, 0 ),
                new Vertex( minX, maxY, 0, 0, 1.0 ),
                new Vertex( maxX, maxY, 0, 1.0, 1.0 ),

                new Vertex( maxX, maxY, 0, 1.0, 1.0 ),
                new Vertex( maxX, minY, 0, 1.0, 0 ),
                new Vertex( minX, minY, 0, 0, 0 )
            ];

            for ( let v of this._vertices ) {
                this._buffer.pushBackData( v.toArray() );
            }

            this._buffer.upload();
            this._buffer.unbind();
        }

        /** Recalculates the vertices for this sprite. */
        protected recalculateVertices(): void {

            let minX = -( this._width * this._origin.x );
            let maxX = this._width * ( 1.0 - this._origin.x );

            let minY = -( this._height * this._origin.y );
            let maxY = this._height * ( 1.0 - this._origin.y );

            this._vertices[0].position.set( minX, minY );
            this._vertices[1].position.set( minX, maxY );
            this._vertices[2].position.set( maxX, maxY );

            this._vertices[3].position.set( maxX, maxY );
            this._vertices[4].position.set( maxX, minY );
            this._vertices[5].position.set( minX, minY );

            this._buffer.clearData();
            for ( let v of this._vertices ) {
                this._buffer.pushBackData( v.toArray() );
            }

            this._buffer.upload();
            this._buffer.unbind();
        }
    }
}