namespace NT {

    /**
     * Represents a color.
     */
    export class Color {

        private _r: number;
        private _g: number;
        private _b: number;
        private _a: number;

        /**
         * Creates a new color.
         * @param r The red value [0-255]
         * @param g The green value [0-255]
         * @param b The blue value [0-255]
         * @param a The alpha value [0-255]
         */
        public constructor( r: number = 255, g: number = 255, b: number = 255, a: number = 255 ) {
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }

        /** The red value [0-255] */
        public get r(): number {
            return this._r;
        }

        /** The red float value [0-1] */
        public get rFloat(): number {
            return this._r / 255.0;
        }

        /** The red value [0-255] */
        public set r( value: number ) {
            this._r = value;
        }

        /** The green value [0-255] */
        public get g(): number {
            return this._g;
        }

        /** The green float value [0-1] */
        public get gFloat(): number {
            return this._g / 255.0;
        }

        /** The green value [0-255] */
        public set g( value: number ) {
            this._g = value;
        }

        /** The blue value [0-255] */
        public get b(): number {
            return this._b;
        }

        /** The blue float value [0-1] */
        public get bFloat(): number {
            return this._b / 255.0;
        }

        /** The blue value [0-255] */
        public set b( value: number ) {
            this._b = value;
        }

        /** The alpha value [0-255] */
        public get a(): number {
            return this._r;
        }

        /** The alpha float value [0-1] */
        public get aFloat(): number {
            return this._a / 255.0;
        }

        /** The alpha value [0-255] */
        public set a( value: number ) {
            this._a = value;
        }

        /** Returns this color as a number array */
        public toArray(): number[] {
            return [this._r, this._g, this._b, this._a];
        }

        /** Returns this color as a float array */
        public toFloatArray(): number[] {
            return [this._r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0];
        }

        /** Returns this color as a float32 array */
        public toFloat32Array(): Float32Array {
            return new Float32Array( this.toFloatArray() );
        }

        /**
         * Creates a new color from the provided JSON.
         * @param json The JSON to create from.
         */
        public static fromJson( json: any ): Color {
            let c = new Color();
            if ( json.r !== undefined ) {
                c.r = Number( json.r );
            }
            if ( json.g !== undefined ) {
                c.g = Number( json.g );
            }
            if ( json.b !== undefined ) {
                c.b = Number( json.b );
            }
            if ( json.a !== undefined ) {
                c.a = Number( json.a );
            }
            return c;
        }

        /** Gets the color white. */
        public static white(): Color {
            return new Color( 255, 255, 255, 255 );
        }

        /** Gets the color black. */
        public static black(): Color {
            return new Color( 0, 0, 0, 255 );
        }

        /** Gets the color red. */
        public static red(): Color {
            return new Color( 255, 0, 0, 255 );
        }

        /** Gets the color green. */
        public static green(): Color {
            return new Color( 0, 255, 0, 255 );
        }

        /** Gets the color blue. */
        public static blue(): Color {
            return new Color( 0, 0, 255, 255 );
        }
    }
}