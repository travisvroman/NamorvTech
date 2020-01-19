namespace NT {

    /** Represents the configuration for a bitmap font. These are typically created and stored in a fonts file. */
    class BitmapFontConfig {

        /** The name of this font. */
        public name: string;

        /** The font file path of this bitmap font. */
        public fontFile: string;

        /**
         * Creates a BitmapFontConfig from the provided JSON.
         * @param json The JSON to create from.
         */
        public static fromJson( json: any ): BitmapFontConfig {
            let config = new BitmapFontConfig();
            if ( json.name !== undefined ) {
                config.name = String( json.name );
            }

            if ( json.fontFile !== undefined ) {
                config.fontFile = String( json.fontFile );
            } else {
                throw new Error( "Cannot create a bitmap font without a font file." );
            }

            return config;
        }
    }

    /** A manager for bitmap fonts. */
    export class BitmapFontManager {

        private static _configLoaded: boolean = false;
        private static _fonts: { [name: string]: BitmapFont } = {};

        /** Hide the constructor to prevent instantiation. */
        private constructor() {
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public static onMessage( message: Message ): void {

            // TODO: one for each asset.
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/fonts/fonts.json" ) {
                Message.unsubscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/fonts/fonts.json",
                    BitmapFontManager.onMessage );

                BitmapFontManager.processFontAsset( message.context as JsonAsset );
            }
        }

        /** Indicates if this manager is loaded. */
        public static get isLoaded(): boolean {
            if ( BitmapFontManager._configLoaded ) {

                // If the config is loaded, check that all fonts are loaded.
                let keys = Object.keys( BitmapFontManager._fonts );
                for ( let key of keys ) {
                    if ( !BitmapFontManager._fonts[key].isLoaded ) {
                        console.debug( "Font " + key + " is still loading..." );
                        return false;
                    }
                }

                console.debug( "All fonts are loaded" );
                return true;
            }

            return false;
        }

        /**
         * Gets a font by the given name.
         * @param name The name of the font.
         */
        public static getFont( name: string ): BitmapFont {
            if ( BitmapFontManager._fonts[name] === undefined ) {
                throw new Error( "A font named " + name + " does not exist." );
            }

            return BitmapFontManager._fonts[name];
        }

        /**
         * Loads registered fonts.
         */
        public static load(): void {

            // Get the asset(s). TODO: This probably should come from a central asset manifest.
            let asset = AssetManager.getAsset( "assets/fonts/fonts.json" );
            if ( asset !== undefined ) {
                BitmapFontManager.processFontAsset( asset as JsonAsset );
            } else {
                
                // Listen for the asset load.
                Message.subscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/fonts/fonts.json",
                    BitmapFontManager.onMessage );
            }
        }

        private static processFontAsset( asset: JsonAsset ): void {

            let fonts = asset.Data.bitmapFonts;
            if ( fonts ) {
                for ( let font of fonts ) {
                    let f = BitmapFontConfig.fromJson( font );
                    BitmapFontManager._fonts[font.name] = new BitmapFont( font.name, font.fontFile );

                    // Start it loading, since all fonts should always be available.
                    BitmapFontManager._fonts[font.name].load();
                }
            }

            // TODO: Should only set this if ALL queued assets have loaded.
            BitmapFontManager._configLoaded = true;
        }
    }
}