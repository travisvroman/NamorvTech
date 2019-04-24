namespace NT {

    export class Renderer {

        private _windowViewport: RendererViewport;

        public constructor( createInfo: RendererViewportCreateInfo ) {
            this._windowViewport = new RendererViewport( createInfo );

        }

        public get windowViewportCanvas(): HTMLCanvasElement {
            return this._windowViewport.canvas;
        }

        public get Projection(): Matrix4x4 {
            return this._windowViewport.GetProjectionMatrix();
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

        }
    }
}