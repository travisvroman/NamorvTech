namespace NT {

    /**
     * Holds reference information for a given Shader.
     */
    class ShaderReferenceNode {

        /** The referenced Shader. */
        public shader: Shader;

        /** The number of times the Shader is referenced. Default is 1 because this is only created when a Shader is needed. */
        public referenceCount: number = 1;

        /**
         * Creates a new ShaderReferenceNode.
         * @param shader The Shader to be referenced.
         */
        public constructor( shader: Shader ) {
            this.shader = shader;
        }
    }

    /**
     * Manages Shaders in the engine. This is responsible for managing Shader references.
     */
    export class ShaderManager {

        private static _shaders: Dictionary<ShaderReferenceNode> = {};
        private static _activeShader: Shader;

        /** Private to enforce singleton pattern. */
        private constructor() {
        }

        /** Initializes this shader manager. */
        public static Initialize(): void {

            // Load builtin shaders.
            ShaderManager.Register( new BasicShader() );
        }

        public static get ActiveShader(): Shader {
            return ShaderManager._activeShader;
        }

        public static set ActiveShader( value: Shader ) {
            if ( ShaderManager._activeShader !== value ) {
                ShaderManager._activeShader = value;
            }
        }

        /**
         * Registers the provided shader.
         * @param shader The shader to be registered.
         */
        public static Register( shader: Shader ): void {
            if ( ShaderManager._shaders[shader.name] !== undefined ) {
                console.warn( `A shader named ${shader.name} already exists and will not be re-registered.` );
            } else {
                ShaderManager._shaders[shader.name] = new ShaderReferenceNode( shader );
            }
        }

        /**
         * Gets a Shader with the given name. This is case-sensitive. If no Shader is found, undefined is returned.
         * Also increments the reference count by 1.
         * @param shaderName The name of the shader to get. If one is not found, a new one is created, using this as the Shader path.
         */
        public static GetShader( shaderName: string ): Shader {
            if ( ShaderManager._shaders[shaderName] !== undefined ) {
                ShaderManager._shaders[shaderName].referenceCount++;
            }

            return ShaderManager._shaders[shaderName].shader;
        }

        /**
         * Releases a reference of a Shader with the provided name and decrements the reference count. 
         * If the Shader's reference count is 0, it is automatically released. 
         * @param shaderName The name of the Shader to be released.
         */
        public static ReleaseShader( shaderName: string ): void {
            if ( ShaderManager._shaders[shaderName] === undefined ) {
                console.warn( `A shader named ${shaderName} does not exist and therefore cannot be released.` );
            } else {
                ShaderManager._shaders[shaderName].referenceCount--;
            }
        }
    }
}