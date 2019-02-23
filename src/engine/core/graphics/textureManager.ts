namespace NT {

    /**
     * Holds reference information for a given Texture.
     */
    class TextureReferenceNode {

        /** The referenced Texture. */
        public texture: Texture;

        /** The number of times the Texture is referenced. Default is 1 because this is only created when a Texture is needed. */
        public referenceCount: number = 1;

        /**
         * Creates a new TextureReferenceNode.
         * @param texture The Texture to be referenced.
         */
        public constructor( texture: Texture ) {
            this.texture = texture;
        }
    }

    /**
     * Manages Textures in the engine. This is responsible for managing Texture references, and automatically
     * destroying unreferenced Texture.
     */
    export class TextureManager {

        private static _textures: { [name: string]: TextureReferenceNode } = {};

        /** Private to enforce singleton pattern. */
        private constructor() {
        }

        /**
         * Gets a Texture with the given name. This is case-sensitive. If no Texture is found, undefined is returned.
         * Also increments the reference count by 1.
         * @param textureName The name of the texture to get. If one is not found, a new one is created, using this as the texture path.
         */
        public static getTexture( textureName: string ): Texture {
            if ( TextureManager._textures[textureName] === undefined ) {
                let texture = new Texture( textureName );
                TextureManager._textures[textureName] = new TextureReferenceNode( texture );
            } else {
                TextureManager._textures[textureName].referenceCount++;
            }

            return TextureManager._textures[textureName].texture;
        }

        /**
         * Releases a reference of a Texture with the provided name and decrements the reference count. 
         * If the Texture's reference count is 0, it is automatically released. 
         * @param textureName The name of the Texture to be released.
         */
        public static releaseTexture( textureName: string ): void {
            if ( TextureManager._textures[textureName] === undefined ) {
                console.warn( `A texture named ${textureName} does not exist and therefore cannot be released.` );
            } else {
                TextureManager._textures[textureName].referenceCount--;
                if ( TextureManager._textures[textureName].referenceCount < 1 ) {
                    TextureManager._textures[textureName].texture.destroy();
                    TextureManager._textures[textureName] = undefined;
                    delete TextureManager._textures[textureName];
                }
            }
        }
    }
}