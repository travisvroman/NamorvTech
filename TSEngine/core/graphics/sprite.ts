namespace TSE {

    /**
     * Represents a 2-dimensional sprite which is drawn on the screen.
     * */
    export class Sprite {

        private _name: string;
        private _width: number;
        private _height: number;

        private _buffer: GLBuffer;
        private _materialName: string;
        private _material: Material;

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

        public get name(): string {
            return this._name;
        }

        public destroy(): void {
            this._buffer.destroy();
            MaterialManager.releaseMaterial( this._materialName );
            this._material = undefined;
            this._materialName = undefined;
        }

        /**
         * Performs loading routines on this sprite.
         * */
        public load(): void {
            this._buffer = new GLBuffer( 5 );

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation( positionAttribute );

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.offset = 3;
            texCoordAttribute.size = 2;
            this._buffer.addAttributeLocation( texCoordAttribute );

            let vertices = [
                // x,y,z   ,u, v
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,

                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0
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
        public draw( shader: Shader, model: Matrix4x4 ): void {

            let modelLocation = shader.getUniformLocation( "u_model" );
            gl.uniformMatrix4fv( modelLocation, false, model.toFloat32Array() );

            let colorLocation = shader.getUniformLocation( "u_tint" );
            gl.uniform4fv( colorLocation, this._material.tint.toFloat32Array() );

            if ( this._material.diffuseTexture !== undefined ) {
                this._material.diffuseTexture.activateAndBind( 0 );
                let diffuseLocation = shader.getUniformLocation( "u_diffuse" );
                gl.uniform1i( diffuseLocation, 0 );
            }

            this._buffer.bind();
            this._buffer.draw();
        }
    }
}