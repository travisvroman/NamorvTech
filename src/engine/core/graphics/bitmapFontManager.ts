namespace NT {

    /** A manager for bitmap fonts. */
    export class BitmapFontManager {

        private static _fonts: { [name: string]: BitmapFont } = {};

        /**
         * Adds a bitmap font to the system.
         * @param name The font to be added.
         * @param fontFileName The info file to load.
         */
        public static addFont( name: string, fontFileName: string ): void {
            BitmapFontManager._fonts[name] = new BitmapFont( name, fontFileName );
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
            let keys = Object.keys( BitmapFontManager._fonts );
            for ( let key of keys ) {
                BitmapFontManager._fonts[key].load();
            }
        }

        /** Performs pre-update procedures on this manager. */
        public static updateReady(): boolean {
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
    }
}