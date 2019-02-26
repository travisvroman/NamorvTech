namespace NT {

    /** A material represents surface information which is used during rendering. */
    export class Material {

        private _name: string;
        private _diffuseTextureName: string;

        private _diffuseTexture: Texture;
        private _tint: Color;

        /**
         * Creates a new material.
         * @param name The name of this material.
         * @param diffuseTextureName The name of the diffuse texture.
         * @param tint The color value of the tint to apply to the material.
         */
        public constructor( name: string, diffuseTextureName: string, tint: Color ) {
            this._name = name;
            this._diffuseTextureName = diffuseTextureName;
            this._tint = tint;

            if ( this._diffuseTextureName !== undefined ) {
                this._diffuseTexture = TextureManager.getTexture( this._diffuseTextureName );
            }
        }

        /**
         * Creates a material from the provided configuration.
         * @param config The configuration to create a material from.
         */
        public static FromConfig( config: MaterialConfig ): Material {
            let m = new Material( config.name, config.diffuse, config.tint );

            return m;
        }

        /** The name of this material. */
        public get name(): string {
            return this._name;
        }

        /** The name of the diffuse texture. */
        public get diffuseTextureName(): string {
            return this._diffuseTextureName;
        }

        /** The diffuse texture. */
        public get diffuseTexture(): Texture {
            return this._diffuseTexture;
        }

        /** The color value of the tint to apply to the material. */
        public get tint(): Color {
            return this._tint;
        }

        /** Sets the diffuse texture name, which triggers a texture load if need be. */
        public set diffuseTextureName( value: string ) {
            if ( this._diffuseTexture !== undefined ) {
                TextureManager.releaseTexture( this._diffuseTextureName );
            }

            this._diffuseTextureName = value;

            if ( this._diffuseTextureName !== undefined ) {
                this._diffuseTexture = TextureManager.getTexture( this._diffuseTextureName );
            }
        }

        /** Destroys this material. */
        public destroy(): void {
            TextureManager.releaseTexture( this._diffuseTextureName );
            this._diffuseTexture = undefined;
        }
    }
}