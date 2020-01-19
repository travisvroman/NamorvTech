namespace NT {

    const LEVEL: number = 0;
    const BORDER: number = 0;
    const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array( [255, 255, 255, 255] );

    /** 
     * Represents a texture to be used in a material. These typically should not be created manually, but 
     * instead via the texture manager.
     */
    export class Texture implements IMessageHandler {

        private _name: string;
        private _handle: WebGLTexture;
        private _isLoaded: boolean = false;
        private _width: number;
        private _height: number;

        /**
         * Creates a new Texture.
         * @param name The name of this texture.
         * @param width The width of this texture.
         * @param height The height of this texture.
         */
        public constructor( name: string, width: number = 1, height: number = 1 ) {
            this._name = name;
            this._width = width;
            this._height = height;

            this._handle = gl.createTexture();

            this.bind();

            gl.texImage2D( gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA );

            let asset = AssetManager.getAsset( this.name ) as ImageAsset;
            if ( asset !== undefined ) {
                this.loadTextureFromAsset( asset );
            } else {
                Message.subscribe( MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this );
            }
        }

        /** The name of this texture. */
        public get name(): string {
            return this._name;
        }

        /** Indicates if this texture is loaded. */
        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        /** The width of this  texture. */
        public get width(): number {
            return this._width;
        }

        /** The height of this texture. */
        public get height(): number {
            return this._height;
        }

        /** Destroys this texture. */
        public destroy(): void {
            if ( this._handle ) {
                gl.deleteTexture( this._handle );
            }
        }

        /**
         * Activates the provided texture unit and binds this texture.
         * @param textureUnit The texture unit to activate on. Default: 0
         */
        public activateAndBind( textureUnit: number = 0 ): void {
            gl.activeTexture( gl.TEXTURE0 + textureUnit );

            this.bind();
        }

        /** Binds this texture. */
        public bind(): void {
            gl.bindTexture( gl.TEXTURE_2D, this._handle );
        }

        /** Binds this texture. */
        public unbind(): void {
            gl.bindTexture( gl.TEXTURE_2D, undefined );
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public onMessage( message: Message ): void {
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name ) {
                this.loadTextureFromAsset( message.context as ImageAsset );
            }
        }

        private loadTextureFromAsset( asset: ImageAsset ): void {
            this._width = asset.width;
            this._height = asset.height;

            this.bind();

            gl.texImage2D( gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.Data );

            if ( this.isPowerof2() ) {
                gl.generateMipmap( gl.TEXTURE_2D );
            } else {

                // Do not generate a mip map and clamp wrapping to edge.
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            }

            // TODO:  Set text ure filte r ing based on configuration.
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

            this._isLoaded = true;
        }

        private isPowerof2(): boolean {
            return ( this.isValuePowerOf2( this._width ) && this.isValuePowerOf2( this.height ) );
        }

        private isValuePowerOf2( value: number ): boolean {
            return ( value & ( value - 1 ) ) == 0;
        }
    }
}