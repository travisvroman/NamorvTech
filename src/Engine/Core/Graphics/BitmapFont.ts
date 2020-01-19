namespace NT {

    class FontUtilities {

        public static extractFieldValue( field: string ): string {
            return field.split( "=" )[1];
        }
    }

    /**
     * A single font glyph used for a bitmap font.
     */
    export class FontGlyph {

        /** The character identifier. */
        public id: number;

        /** The x position within the bitmap. */
        public x: number;

        /** The y position within the bitmap. */
        public y: number;

        /** The width of the glyph within the bitmap. */
        public width: number;

        /** The height of the glyph within the bitmap. */
        public height: number;

        /** The x offset amount. */
        public xOffset: number;

        /** The y offset amount. */
        public yOffset: number;

        /** The amount to advance after this character. */
        public xAdvance: number;

        /** The page/texture id. */
        public page: number;

        /** The channel id. */
        public channel: number;

        /**
         * Extracts a glyph from the provided fields.
         * @param fields The fields to extract from.
         */
        public static fromFields( fields: string[] ): FontGlyph {
            let glyph: FontGlyph = new FontGlyph();

            glyph.id = Number( FontUtilities.extractFieldValue( fields[1] ) );
            glyph.x = Number( FontUtilities.extractFieldValue( fields[2] ) );
            glyph.y = Number( FontUtilities.extractFieldValue( fields[3] ) );
            glyph.width = Number( FontUtilities.extractFieldValue( fields[4] ) );
            glyph.height = Number( FontUtilities.extractFieldValue( fields[5] ) );
            glyph.xOffset = Number( FontUtilities.extractFieldValue( fields[6] ) );
            glyph.yOffset = Number( FontUtilities.extractFieldValue( fields[7] ) );
            glyph.xAdvance = Number( FontUtilities.extractFieldValue( fields[8] ) );
            glyph.page = Number( FontUtilities.extractFieldValue( fields[9] ) );
            glyph.channel = Number( FontUtilities.extractFieldValue( fields[10] ) );

            return glyph;
        }
    }

    /**
     * A composition of configuration and images which allows text to be drawn to the screen.
     */
    export class BitmapFont implements IMessageHandler {

        private _name: string;
        private _fontFileName: string;
        private _assetLoaded: boolean = false;
        private _imageFile: string;
        private _glyphs: { [id: number]: FontGlyph } = {};
        private _size: number;
        private _imageWidth: number;
        private _imageHeight: number;

        /**
         * Creates a new bitmap font.
         * @param name The name of the font.
         * @param fontFile The font info file.
         */
        public constructor( name: string, fontFile: string ) {
            this._name = name;
            this._fontFileName = fontFile;
        }

        /** The name of the font. */
        public get name(): string {
            return this._name;
        }

        /** The size of this font. */
        public get size(): number {
            return this._size;
        }

        /** The width of the image used for this font. */
        public get imageWidth(): number {
            return this._imageWidth;
        }

        /** The height of the image used for this font. */
        public get imageHeight(): number {
            return this._imageHeight;
        }

        /** The name of the texture image used for this font. */
        public get textureName(): string {
            return this._imageFile;
        }

        /** Indicates if this bitmap font is loaded. */
        public get isLoaded(): boolean {
            return this._assetLoaded;
        }

        /** Loads this font. */
        public load(): void {
            let asset = AssetManager.getAsset( this._fontFileName );
            if ( asset !== undefined ) {
                this.processFontFile( asset.Data );
            } else {
                Message.subscribe( MESSAGE_ASSET_LOADER_ASSET_LOADED + this._fontFileName, this );
            }
        }

        /**
         * The message handler.
         */
        public onMessage( message: Message ): void {
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._fontFileName ) {
                this.processFontFile( ( message.context as TextAsset ).Data );
            }
        }

        /**
         * Gets a glyph for the provided character.
         * @param char The character to retrieve a glyph for.
         */
        public getGlyph( char: string ): FontGlyph {

            // Replace unrecognized characters with a '?'.
            let code = char.charCodeAt( 0 );
            code = ( this._glyphs[code] === undefined ) ? 63 : code;
            return this._glyphs[code];
        }

        /**
         * Measures the provided text in the x and y dimensions.
         * @param text The text to be measured.
         */
        public measureText( text: string ): Vector2 {
            let size: Vector2 = Vector2.zero;

            let maxX = 0;
            let x = 0;
            let y = 0;

            for ( let c of text ) {
                switch ( c ) {
                    case "\n":
                        if ( x > maxX ) {
                            maxX = x;
                        }
                        x = 0;
                        y += this._size;
                        break;
                    default:
                        x += this.getGlyph( c ).xAdvance;
                        break;
                }
            }

            size.set( maxX, y );
            return size;
        }

        private processFontFile( content: string ): void {
            let charCount: number = 0;
            let lines: string[] = content.split( "\n" );
            for ( let line of lines ) {

                // Sanitize the line.
                let data = line.replace( /\s\s+/g, ' ' );
                let fields = data.split( " " );

                // Look at the type of line
                switch ( fields[0] ) {
                    case "info":
                        this._size = Number( FontUtilities.extractFieldValue( fields[2] ) );
                        break;
                    case "common":
                        this._imageWidth = Number( FontUtilities.extractFieldValue( fields[3] ) );
                        this._imageHeight = Number( FontUtilities.extractFieldValue( fields[4] ) );
                        break;
                    case "page":
                        {
                            let id: number = Number( FontUtilities.extractFieldValue( fields[1] ) );

                            this._imageFile = FontUtilities.extractFieldValue( fields[2] );

                            // Strip quotes.
                            this._imageFile = this._imageFile.replace( /"/g, "" );

                            // Prepend the path to the image name. TODO: This should be configurable.
                            this._imageFile = ( "assets/fonts/" + this._imageFile ).trim();
                        }
                        break;
                    case "chars":
                        charCount = Number( FontUtilities.extractFieldValue( fields[1] ) );

                        // Increment the expected count, the file's count is off by one.
                        charCount++;
                        break;
                    case "char":
                        {
                            let glyph = FontGlyph.fromFields( fields );
                            this._glyphs[glyph.id] = glyph;
                        }
                        break;
                }
            }

            // Verify the loaded glyphs
            let actualGlyphCount = 0;

            // Only count properties
            let keys = Object.keys( this._glyphs );
            for ( let key of keys ) {
                if ( this._glyphs.hasOwnProperty( key ) ) {
                    actualGlyphCount++;
                }
            }

            if ( actualGlyphCount !== charCount ) {
                throw new Error( `Font file reported existence of ${charCount} glyphs, but only ${actualGlyphCount} were found.` );
            }

            this._assetLoaded = true;
        }
    }
}