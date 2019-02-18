namespace TSE {


    export class BasicShader extends Shader {
        
        public constructor() {
            super( "basic" );

            this.load( this.getVertexSource(), this.getFragmentSource() );
        }


        private getVertexSource(): string {

            return `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projection;
uniform mat4 u_model;

varying vec2 v_texCoord;

void main() {
    gl_Position = u_projection * u_model * vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
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