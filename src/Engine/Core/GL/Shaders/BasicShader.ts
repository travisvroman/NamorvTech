namespace NT {

    /**
     * A basic shader that can be used for 2D games.
     */
    export class BasicShader extends Shader {


        public constructor() {
            super( BuiltinShader.BASIC );

            this.load( this.getVertexSource(), this.getFragmentSource() );
        }

        public ApplyStandardUniforms( material: Material, model: Matrix4x4, view: Matrix4x4, projection: Matrix4x4 ): void {
            // Set uniforms.
            // let projectionPosition = this.getUniformLocation( "u_projection" );
            // let projection = this._windowViewport.GetProjectionMatrix().toFloat32Array();
            // gl.uniformMatrix4fv( projectionPosition, false, projection );


            // // Use the active camera's matrix as the view
            // let view: Matrix4x4;
            // if ( LevelManager.isLoaded && LevelManager.activeLevelActiveCamera !== undefined ) {
            //     view = LevelManager.activeLevelActiveCamera.view;
            // } else {
            //     view = Matrix4x4.identity();
            // }
            // let viewPosition = this._basicShader.getUniformLocation( "u_view" );
            // gl.uniformMatrix4fv( viewPosition, false, view.toFloat32Array() );
            
            this.use();
            this.SetUniformMatrix4x4( "u_model", model );
            this.SetUniformMatrix4x4( "u_view", view );
            this.SetUniformMatrix4x4( "u_projection", projection );
            this.SetUniformColor( "u_tint", material.tint );

            if ( material.diffuseTexture !== undefined ) {
                material.diffuseTexture.activateAndBind( 0 );
                this.SetUniformInt( "u_diffuse", 0 );
            }
        }


        private getVertexSource(): string {

            return `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_view;
uniform mat4 u_model;
uniform mat4 u_projection;

varying vec2 v_texCoord;
varying vec3 v_fragPosition;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
    v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
}`;
        }

        private getFragmentSource(): string {
            return `
precision mediump float;

uniform vec4 u_tint;
uniform sampler2D u_diffuse;

varying vec2 v_texCoord;

void main() {
    gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
}
`;
        }
    }
}