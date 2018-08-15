namespace TSE {

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
            return ["png", "gif", "jpg"];
        }

        /**
         * Loads an asset with the given name.
         * @param assetName The name of the asset to be loaded.
         */
        public loadAsset( assetName: string ): void {
            let image: HTMLImageElement = new Image();
            image.onload = this.onImageLoaded.bind( this, assetName, image );
            image.src = assetName;
        }

        private onImageLoaded( assetName: string, image: HTMLImageElement ): void {
            console.log( "onImageLoaded: assetName/image", assetName, image );
            let asset = new ImageAsset( assetName, image );
            AssetManager.onAssetLoaded( asset );
        }
    }
}