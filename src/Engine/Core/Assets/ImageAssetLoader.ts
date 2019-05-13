namespace NT {

    /** Represents an image asset */
    export class ImageAsset implements IAsset {

        /** The name of this asset. */
        public readonly name: string;

        /** The data of this asset. */
        public readonly data: HTMLImageElement;

        /**
         * Creates a new image asset.
         * @param name The name of this asset.
         * @param data The data of this asset.
         */
        public constructor( name: string, data: HTMLImageElement ) {
            this.name = name;
            this.data = data;
        }

        /** The width of this image asset. */
        public get width(): number {
            return this.data.width;
        }

        /** The height of this image asset. */
        public get height(): number {
            return this.data.height;
        }
    }

    /** Represents an image asset loader. */
    export class ImageAssetLoader implements IAssetLoader {

        /** The extensions supported by this asset loader. */
        public get supportedExtensions(): string[] {
            return ["png", "gif", "jpg", "tga"];
        }

        /**
         * Loads an asset with the given name.
         * @param assetName The name of the asset to be loaded.
         */
        public loadAsset( assetName: string ): void {
            let extension = assetName.substring( assetName.lastIndexOf( '.' ) + 1, assetName.length ) || assetName;

            switch ( extension.toLowerCase() ) {
                case "tga":

                    // Special targa loading process.
                    console.log( "Downloading targa file..." );
                    let request: XMLHttpRequest = new XMLHttpRequest();
                    request.responseType = "arraybuffer";
                    request.open( "GET", assetName );
                    request.addEventListener( "load", this.onTgaLoaded.bind( this, assetName, request ) );
                    request.send();
                    break;
                default:

                    // Normal image loading process.
                    let image: HTMLImageElement = new Image();
                    image.onload = this.onImageLoaded.bind( this, assetName, image );
                    image.src = assetName;
                    break;
            }
        }

        private onImageLoaded( assetName: string, image: HTMLImageElement ): void {
            //console.log( "onImageLoaded: assetName/image", assetName, image );
            console.log( "onImageLoaded: assetName/image", assetName );
            let asset = new ImageAsset( assetName, image );
            AssetManager.onAssetLoaded( asset );
        }

        private onTgaLoaded( assetName: string, request: XMLHttpRequest ): void {
            console.log( "onTgaLoaded: assetName/request", assetName );

            if ( request.readyState === request.DONE ) {
                let imageDataurl = TargaProcessor.loadToDataUrl( request.response );

                // From the loaded data url, hook into the normal image loading method.
                let image: HTMLImageElement = new Image();
                image.onload = this.onImageLoaded.bind( this, assetName, image );
                image.src = imageDataurl;
            }
        }
    }
}