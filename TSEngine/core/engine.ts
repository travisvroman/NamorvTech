namespace TSE {

    /**
     * The main game engine class.
     * */
    export class Engine implements IMessageHandler {

        private _canvas: HTMLCanvasElement;
        private _basicShader: BasicShader;
        private _projection: Matrix4x4;
        private _previousTime: number = 0;
        private _gameWidth: number;
        private _gameHeight: number;

        /**
         * Creates a new engine.
         * @param width The width of the game in pixels.
         * @param height The height of the game in pixels.
         * */
        public constructor( width?: number, height?: number ) {
            this._gameWidth = width;
            this._gameHeight = height;
        }

        /**
         * Starts up this engine.
         * */
        public start(): void {

            this._canvas = GLUtilities.initialize();
            if ( this._gameWidth !== undefined && this._gameHeight !== undefined ) {
                this._canvas.style.width = this._gameWidth + "px";
                this._canvas.style.height = this._gameHeight + "px";
                this._canvas.width = this._gameWidth;
                this._canvas.height = this._gameHeight;
            }
            AssetManager.initialize();
            InputManager.initialize();
            ZoneManager.initialize();

            gl.clearColor( 146 / 255, 206 / 255, 247 / 255, 1 );
            gl.enable( gl.BLEND );
            gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // Load materials
            MaterialManager.registerMaterial( new Material( "bg", "assets/textures/bg.png", Color.white() ) );
            MaterialManager.registerMaterial( new Material( "end", "assets/textures/end.png", Color.white() ) );
            MaterialManager.registerMaterial( new Material( "middle", "assets/textures/middle.png", Color.white() ) );
            MaterialManager.registerMaterial( new Material( "grass", "assets/textures/grass.png", Color.white() ) );
            MaterialManager.registerMaterial( new Material( "duck", "assets/textures/duck.png", Color.white() ) );

            AudioManager.loadSoundFile( "flap", "assets/sounds/flap.mp3", false );
            AudioManager.loadSoundFile( "ting", "assets/sounds/ting.mp3", false );
            AudioManager.loadSoundFile( "dead", "assets/sounds/dead.mp3", false );

            // Load
            this._projection = Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0 );

            // TODO: Change this to be read from a game configuration later.
            ZoneManager.changeZone( 0 );

            this.resize();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window.
         * */
        public resize(): void {
            if ( this._canvas !== undefined ) {
                if ( this._gameWidth === undefined || this._gameHeight === undefined ) {
                    this._canvas.width = window.innerWidth;
                    this._canvas.height = window.innerHeight;
                }

                gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
                this._projection = Matrix4x4.orthographic( 0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0 );
            }
        }

        public onMessage( message: Message ): void {
            if ( message.code === "MOUSE_UP" ) {
                let context = message.context as MouseContext;
                document.title = `Pos: [${context.position.x},${context.position.y}]`;
            }
        }

        private loop(): void {
            this.update();
            this.render();
        }

        private update(): void {
            let delta = performance.now() - this._previousTime;

            MessageBus.update( delta );
            ZoneManager.update( delta );
            CollisionManager.update( delta );

            this._previousTime = performance.now();
        }

        private render(): void {
            gl.clear( gl.COLOR_BUFFER_BIT );

            ZoneManager.render( this._basicShader );
            // Set uniforms.
            let projectionPosition = this._basicShader.getUniformLocation( "u_projection" );
            gl.uniformMatrix4fv( projectionPosition, false, new Float32Array( this._projection.data ) );

            requestAnimationFrame( this.loop.bind( this ) );
        }
    }
}