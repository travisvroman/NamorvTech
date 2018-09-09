namespace TSE {

    /** Represents an Json asset */
    export class JsonAsset implements IAsset {

        /** The name of this asset. */
        public readonly name: string;

        /** The data of this asset. */
        public readonly data: any;

        /**
         * Creates a new image asset.
         * @param name The name of this asset.
         * @param data The data of this asset.
         */
        public constructor( name: string, data: any ) {
            this.name = name;
            this.data = data;
        }
    }

    /** Represents an Json asset loader. */
    export class JsonAssetLoader implements IAssetLoader {

        /** The extensions supported by this asset loader. */
        public get supportedExtensions(): string[] {
            return ["json"];
        }

        /**
         * Loads an asset with the given name.
         * @param assetName The name of the asset to be loaded.
         */
        public loadAsset( assetName: string ): void {
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open( "GET", assetName );
            request.addEventListener( "load", this.onJsonLoaded.bind( this, assetName, request ) );
            request.send();
        }

        private onJsonLoaded( assetName: string, request: XMLHttpRequest ): void {
            console.log( "onJsonLoaded: assetName/request", assetName, request );

            if ( request.readyState === request.DONE ) {
                let json = JSON.parse( request.responseText );
                let asset = new JsonAsset( assetName, json );
                AssetManager.onAssetLoaded( asset );
            }
        }
    }
}