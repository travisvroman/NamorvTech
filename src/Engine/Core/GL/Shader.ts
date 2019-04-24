namespace NT {

    export enum BuiltinShader {
        BASIC = "basic"
    }

    /**
     * Represents a WebGL shader.
     * */
    export abstract class Shader {

        private _name: string;
        private _program: WebGLProgram;
        private _attributes: { [name: string]: number } = {};
        private _uniforms: { [name: string]: WebGLUniformLocation } = {};

        /**
         * Creates a new shader.
         * @param name The name of this shader.
         */
        public constructor( name: string ) {
            this._name = name;
        }

        /**
         * Destroys this shader.
         */
        public destroy(): void {

        }

        /**
         * The name of this shader.
         */
        public get name(): string {
            return this._name;
        }

        /**
         * Use this shader.
         * */
        public use(): void {
            if ( ShaderManager.ActiveShader !== this ) {
                gl.useProgram( this._program );
                ShaderManager.ActiveShader = this;
            }
        }

        public SetUniformMatrix4x4( uniformName: string, matrix: Matrix4x4 ): void {
            if ( this._uniforms[uniformName] === undefined ) {
                console.warn( `Unable to find uniform named '${uniformName}' in shader named '${this._name}'` );
                return;
            }

            let position = this.getUniformLocation( uniformName );
            gl.uniformMatrix4fv( position, false, matrix.toFloat32Array() );
        }

        public SetUniformColor( uniformName: string, color: Color ): void {
            if ( this._uniforms[uniformName] === undefined ) {
                console.warn( `Unable to find uniform named '${uniformName}' in shader named '${this._name}'` );
                return;
            }

            let position = this.getUniformLocation( uniformName );
            gl.uniform4fv( position, color.toFloat32Array() );
        }

        public SetUniformInt( uniformName: string, value: number ): void {
            if ( this._uniforms[uniformName] === undefined ) {
                console.warn( `Unable to find uniform named '${uniformName}' in shader named '${this._name}'` );
                return;
            }

            let position = this.getUniformLocation( uniformName );
            gl.uniform1i( position, value );
        }

        /**
         * Gets the location of an attribute with the provided name.
         * @param name The name of the attribute whose location to retrieve.
         */
        public getAttributeLocation( name: string ): number {
            if ( this._attributes[name] === undefined ) {
                throw new Error( `Unable to find attribute named '${name}' in shader named '${this._name}'` );
            }

            return this._attributes[name];
        }

        /**
         * Gets the location of an uniform with the provided name.
         * @param name The name of the uniform whose location to retrieve.
         */
        public getUniformLocation( name: string ): WebGLUniformLocation {
            if ( this._uniforms[name] === undefined ) {
                throw new Error( `Unable to find uniform named '${name}' in shader named '${this._name}'` );
            }

            return this._uniforms[name];
        }

        /**
         * Applies standard uniforms to this shader.
         */
        public abstract ApplyStandardUniforms( material: Material, model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4 ): void;

        /**
         * Loads this shader.
         * @param vertexSource The vertex source.
         * @param fragmentSource The fragment source.
         */
        protected load( vertexSource: string, fragmentSource: string ): void {
            let vertexShader = this.loadShader( vertexSource, gl.VERTEX_SHADER );
            let fragmentShader = this.loadShader( fragmentSource, gl.FRAGMENT_SHADER );

            this.createProgram( vertexShader, fragmentShader );

            this.detectAttributes();
            this.detectUniforms();
        }

        private loadShader( source: string, shaderType: number ): WebGLShader {
            let shader: WebGLShader = gl.createShader( shaderType );

            gl.shaderSource( shader, source );
            gl.compileShader( shader );
            let error = gl.getShaderInfoLog( shader ).trim();
            if ( error !== "" ) {
                throw new Error( "Error compiling shader '" + this._name + "': " + error );
            }

            return shader;
        }

        private createProgram( vertexShader: WebGLShader, fragmentShader: WebGLShader ): void {
            this._program = gl.createProgram();

            gl.attachShader( this._program, vertexShader );
            gl.attachShader( this._program, fragmentShader );

            gl.linkProgram( this._program );

            let error = gl.getProgramInfoLog( this._program ).trim();
            if ( error !== "" ) {
                throw new Error( "Error linking shader '" + this._name + "': " + error );
            }
        }

        private detectAttributes(): void {
            let attributeCount = gl.getProgramParameter( this._program, gl.ACTIVE_ATTRIBUTES );
            for ( let i = 0; i < attributeCount; ++i ) {
                let info: WebGLActiveInfo = gl.getActiveAttrib( this._program, i );
                if ( !info ) {
                    break;
                }

                this._attributes[info.name] = gl.getAttribLocation( this._program, info.name );
            }
        }

        private detectUniforms(): void {
            let uniformCount = gl.getProgramParameter( this._program, gl.ACTIVE_UNIFORMS );
            for ( let i = 0; i < uniformCount; ++i ) {
                let info: WebGLActiveInfo = gl.getActiveUniform( this._program, i );
                if ( !info ) {
                    break;
                }

                this._uniforms[info.name] = gl.getUniformLocation( this._program, info.name );
            }
        }
    }
}