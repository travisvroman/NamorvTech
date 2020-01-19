namespace NT {

    /** Indicates the type of projection used by a viewport. */
    export enum ViewportProjectionType {

        /** Orthographic projection. Useful for 2D games. */
        ORTHOGRAPHIC,

        /** Perspective projection. Useful for 3D games. */
        PERSPECTIVE
    }

    /** Indicates the viewport size mode. */
    export enum ViewportSizeMode {

        /** The viewport is a fixed size and maintains an aspect ratio upon window resize. */
        FIXED,

        /** The viewport is a dynamic size and does NOT maintain an aspect ratio upon window resize. */
        DYNAMIC
    }

    export class RendererViewportCreateInfo {

        /** The x-position of the viewport. */
        public x?: number;

        /** The y-position of the viewport. */
        public y?: number;

        /** The width of this viewport. Optional. Only declare this for a fixed viewport size. */
        public width?: number;

        /** The height of this viewport. Optional. Only declare this for a fixed viewport size. */
        public height?: number;

        /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE. */
        public fov?: number;

        /** The distance to the near clipping plane. */
        public nearClip: number;

        /** The distance to the far clipping plane. */
        public farClip: number;

        /** The type of projection used by this viewport. */
        public projectionType: ViewportProjectionType;

        /** The element id of the HTMLCanvasElement to use. If undefined, one will be created dynamically. */
        public elementId?: string;
    }

    /**
     * Represents a viewport used by a renderer. Responsible for maintaining aspect ratio and 
     * projection matrices.
     */
    export class RendererViewport {
        private _isDirty: boolean = true;
        private _x: number;
        private _y: number;
        private _width: number;
        private _height: number;
        private _fov: number;
        private _nearClip: number;
        private _farClip: number;
        private _projectionType: ViewportProjectionType;
        private _projection: Matrix4x4;
        private _sizeMode: ViewportSizeMode = ViewportSizeMode.DYNAMIC;

        private _canvas: HTMLCanvasElement;

        /**
         * Creates a new RendererViewport.
         * @param createInfo The viewport creation info.
         */
        public constructor( createInfo: RendererViewportCreateInfo ) {

            this._width = createInfo.width;
            this._height = createInfo.height;
            this._x = createInfo.x;
            this._y = createInfo.y;
            this._nearClip = createInfo.nearClip;
            this._farClip = createInfo.farClip;
            this._fov = createInfo.fov;
            this._projectionType = createInfo.projectionType;

            if ( this._width !== undefined && this._height !== undefined ) {
                //this._aspect = this._width / this._height;
                this._sizeMode = ViewportSizeMode.FIXED;
            }

            this._canvas = GLUtilities.Initialize( createInfo.elementId );

            // GL init
            //gl.clearColor( 146 / 255, 206 / 255, 247 / 255, 1 );
            gl.clearColor( 0, 0, 0.2, 1 );
            gl.enable( gl.BLEND );
            gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

            // Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0 )
        }

        /** The canvas this viewport is rendered to. */
        public get canvas(): HTMLCanvasElement {
            return this._canvas;
        }

        /** The width of this viewport. */
        public get width(): number {
            return this._width;
        }

        /** The height of this viewport. */
        public get height(): number {
            return this._height;
        }

        /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE. */
        public get fov(): number {
            return this._fov;
        }

        /** The field of view in radians. Only used by ViewportProjectionType.PERSPECTIVE. */
        public set fov( value: number ) {
            this._fov = value;
            this._isDirty = true;
        }

        /** The x-position of the viewport. */
        public get x(): number {
            return this._x;
        }

        /** The y-position of the viewport. */
        public get y(): number {
            return this._y;
        }

        /** The distance to the near clipping plane. */
        public get nearClip(): number {
            return this._nearClip;
        }

        /** The distance to the near clipping plane. */
        public set nearClip( value: number ) {
            this._nearClip = value;
            this._isDirty = true;
        }

        /** The distance to the far clipping plane. */
        public get farClip(): number {
            return this._farClip;
        }

        /** The distance to the far clipping plane. */
        public set farClip( value: number ) {
            this._farClip = value;
            this._isDirty = true;
        }

        /** The type of projection used by this viewport. */
        public get projectionType(): ViewportProjectionType {
            return this._projectionType;
        }

        /** The type of projection used by this viewport. */
        public set projectionType( value: ViewportProjectionType ) {
            this._projectionType = value;
            this._isDirty = true;
        }

        /** Returns the appropriate projection matrix for this viewport. */
        public GetProjectionMatrix(): Matrix4x4 {
            if ( this._isDirty || this._projection === undefined ) {
                this.regenerateMatrix();
            }
            return this._projection;
        }

        /**
         * Called when this viewport should be resized.
         * @param width The new width of this viewport.
         * @param height The new height of this viewport.
         */
        public OnResize( width: number, height: number ): void {
            this._width = width;
            this._height = height;
            this._isDirty = true;

            if ( this._canvas !== undefined ) {
                if ( this._sizeMode === ViewportSizeMode.DYNAMIC ) {

                    // Adjust the viewport to fill the screen.
                    this._canvas.width = window.innerWidth;
                    this._canvas.height = window.innerHeight;
                    this._width = window.innerWidth;
                    this._height = window.innerHeight;
                    gl.viewport( this._x, this._y, this._width, this._height );
                    //this._projection = Matrix4x4.orthographic( this.x, window.innerWidth, window.innerHeight, this.y, -100.0, 100.0 );
                } else {

                    // Keep the aspect ratio of the viewport.
                    let newWidth = window.innerWidth;
                    let newHeight = window.innerHeight;
                    let newWidthToHeight = newWidth / newHeight;
                    let gameArea = document.getElementById( "gameArea" );
                    let aspect = this._width / this._height;

                    if ( newWidthToHeight > aspect ) {
                        newWidth = newHeight * aspect;
                        gameArea.style.height = newHeight + 'px';
                        gameArea.style.width = newWidth + 'px';
                    } else {
                        newHeight = newWidth / aspect;
                        gameArea.style.width = newWidth + 'px';
                        gameArea.style.height = newHeight + 'px';
                    }

                    gameArea.style.marginTop = ( -newHeight / 2 ) + 'px';
                    gameArea.style.marginLeft = ( -newWidth / 2 ) + 'px';

                    this._canvas.width = newWidth;
                    this._canvas.height = newHeight;

                    gl.viewport( this._x, this._y, newWidth, newHeight );
                    //this._projection = Matrix4x4.orthographic( this.x, this._width, this._height, this.y, -100.0, 100.0 );

                    // NOTE: The renderer shouldn't care about setting this in the input manager. May want to do this with messages instead.
                    let resolutionScale = new Vector2( newWidth / this._width, newHeight / this._height );
                    InputManager.setResolutionScale( resolutionScale );
                }
            }
        }

        /**
         * Called when this viewport should be repositioned.
         * @param width The new x-position of this viewport.
         * @param height The new y-position of this viewport.
         */
        public Reposition( x: number, y: number ): void {
            this._x = x;
            this._y = y;
            this._isDirty = true;
        }

        private regenerateMatrix(): void {
            if ( this._projectionType === ViewportProjectionType.ORTHOGRAPHIC ) {
                this._projection = Matrix4x4.orthographic( this._x, this._width, this._height, this._y, this._nearClip, this._farClip );
            } else {
                this._projection = Matrix4x4.perspective( this._fov, this._width / this._height, this._nearClip, this._farClip );
            }
            this._isDirty = false;
        }
    }
}