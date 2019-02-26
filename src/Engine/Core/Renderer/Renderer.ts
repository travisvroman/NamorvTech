namespace NT {

    export class Renderer {

        private _windowViewport: RendererViewport;

        private _basicShader: BasicShader;

        public constructor( createInfo: RendererViewportCreateInfo ) {
            this._windowViewport = new RendererViewport( createInfo );

        }

        public get windowViewportCanvas(): HTMLCanvasElement {
            return this._windowViewport.canvas;
        }

        public get worldShader(): Shader {
            return this._basicShader;
        }

        public Initialize(): void {

            this._basicShader = new BasicShader();
            this._basicShader.use();
        }

        public Resize(): void {
            if ( this._windowViewport ) {
                this._windowViewport.OnResize( window.innerWidth, window.innerHeight );
            }
        }

        public BeginRender(): void {
            gl.clear( gl.COLOR_BUFFER_BIT );
        }

        public EndRender(): void {
            // Set uniforms.
            let projectionPosition = this._basicShader.getUniformLocation( "u_projection" );
            let projection = this._windowViewport.GetProjectionMatrix().toFloat32Array();
            gl.uniformMatrix4fv( projectionPosition, false, projection );
        }
    }
}