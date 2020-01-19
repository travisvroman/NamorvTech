namespace NT {

    /** Represents an asset loader. */
    export interface IAssetLoader {

        /** The extensions supported by this asset loader. */
        readonly supportedExtensions: string[];

        /**
         * Loads an asset with the given name.
         * @param assetName The name of the asset to be loaded.
         */
        LoadAsset( assetName: string ): void;
    }
}