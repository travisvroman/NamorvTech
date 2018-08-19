namespace TSE {

    const LEVEL: number = 0;
    const BORDER: number = 0;
    const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array( [255, 255, 255, 255] );


    export class Texture implements IMessageHandler {

        private _name: string;
        private _handle: WebGLTexture;
        private _isLoaded: boolean = false;
        private _width: number;
        private _height: number;


        public constructor( name: string, width: number = 1, height: number = 1 ) {
            this._name = name;
            this._width = width;
            this._height = height;

            this._handle = gl.createTexture();

            Message.subscribe( MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this );

            this.bind();

            gl.texImage2D( gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA );

            let asset = AssetManager.getAsset( this.name ) as ImageAsset;
            if ( asset !== undefined ) {
                this.loadTextureFromAsset( asset );
            }
        }

        public get name(): string {
            return this._name;
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public get width(): number {
            return this._width;
        }

        public get height(): number {
            return this._height;
        }

        public destroy(): void {
            gl.deleteTexture( this._handle );
        }

        public activateAndBind( textureUnit: number = 0 ): void {
            gl.activeTexture( gl.TEXTURE0 + textureUnit );

            this.bind();
        }

        public bind(): void {
            gl.bindTexture( gl.TEXTURE_2D, this._handle );
        }

        public unbind(): void {
            gl.bindTexture( gl.TEXTURE_2D, undefined );
        }

        public onMessage( message: Message ): void {
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name ) {
                this.loadTextureFromAsset( message.context as ImageAsset );
            }
        }


        private loadTextureFromAsset( asset: ImageAsset ): void {
            this._width = asset.width;
            this._height = asset.height;

            this.bind();

            gl.texImage2D( gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data );

            if ( this.isPowerof2() ) {
                gl.generateMipmap( gl.TEXTURE_2D );
            } else {

                // Do not generate a mip map and clamp wrapping to edge.
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
            }

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