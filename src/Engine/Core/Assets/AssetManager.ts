namespace NT {

    /**
     * The message code prefix for asset load notifications.
     */
    export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";

    /** Manages all assets in the engine. */
    export class AssetManager {

        private static _loaders: IAssetLoader[] = [];
        private static _loadedAssets: { [name: string]: IAsset } = {};

        /** Private to enforce static method calls and prevent instantiation. */
        private constructor() {
        }

        /** Initializes this manager. */
        public static Initialize(): void {
            AssetManager._loaders.push( new ImageAssetLoader() );
            AssetManager._loaders.push( new JsonAssetLoader() );
            AssetManager._loaders.push( new TextAssetLoader() );
        }

        /**
         * Registers the provided loader with this asset manager.
         * @param loader The loader to be registered.
         */
        public static registerLoader( loader: IAssetLoader ): void {
            AssetManager._loaders.push( loader );
        }

        /**
         * A callback to be made from an asset loader when an asset is loaded.
         * @param asset
         */
        public static onAssetLoaded( asset: IAsset ): void {
            AssetManager._loadedAssets[asset.Name] = asset;
            Message.send( MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.Name, this, asset );
        }

        /**
         * Attempts to load an asset using a registered asset loader.
         * @param assetName The name/url of the asset to be loaded.
         */
        public static loadAsset( assetName: string ): void {
            let extension = assetName.split( '.' ).pop().toLowerCase();
            for ( let l of AssetManager._loaders ) {
                if ( l.supportedExtensions.indexOf( extension ) !== -1 ) {
                    l.LoadAsset( assetName );
                    return;
                }
            }

            console.warn( "Unable to load asset with extension " + extension + " because there is no loader associated with it." );
        }

        /**
         * Indicates if an asset with the provided name has been loaded.
         * @param assetName The asset name to check.
         */
        public static isAssetLoaded( assetName: string ): boolean {
            return AssetManager._loadedAssets[assetName] !== undefined;
        }

        /**
         * Attempts to get an asset with the provided name. If found, it is returned; otherwise, undefined is returned.
         * @param assetName The asset name to get.
         */
        public static getAsset( assetName: string ): IAsset {
            if ( AssetManager._loadedAssets[assetName] !== undefined ) {
                return AssetManager._loadedAssets[assetName];
            } else {
                AssetManager.loadAsset( assetName );
            }

            return undefined;
        }
    }
}