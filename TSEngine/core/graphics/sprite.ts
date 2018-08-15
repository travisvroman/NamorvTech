namespace TSE {

    /**
     * Represents a 2-dimensional sprite which is drawn on the screen.
     * */
    export class Sprite {

        private _name: string;
        private _width: number;
        private _height: number;

        private _buffer: GLBuffer;

        /**
         * The position of this sprite.
         */
        public position: Vector3 = new Vector3();

        /**
         * Creates a new sprite.
         * @param name The name of this sprite.
         * @param width The width of this sprite.
         * @param height The height of this sprite.
         */
        public constructor( name: string, width: number = 100, height: number = 100 ) {
            this._name = name;
            this._width = width;
            this._height = height;
        }

        /**
         * Performs loading routines on this sprite.
         * */
        public load(): void {
            this._buffer = new GLBuffer( 3 );

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation( positionAttribute );

            let vertices = [
                // x,y,z
                0, 0, 0,
                0, this._height, 0,
                this._width, this._height, 0,

                this._width, this._height, 0,
                this._width, 0, 0,
                0, 0, 0
            ];

            this._buffer.pushBackData( vertices );
            this._buffer.upload();
            this._buffer.unbind();
        }

        /**
         * Performs update routines on this sprite.
         * @param time The delta time in milliseconds since the last update call.
         */
        public update( time: number ): void {

        }

        /** Draws this sprite. */
        public draw(): void {
            this._buffer.bind();
            this._buffer.draw();
        }
    }
}