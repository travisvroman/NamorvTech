namespace NT {

    /**
     * The main game engine class.
     * */
    export class Engine {

        private _previousTime: number = 0;
        private _gameWidth: number;
        private _gameHeight: number;

        private _isFirstUpdate: boolean = true;

        private _renderer: Renderer;
        private _game: IGame;

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
         * @param game The object containing game-specific logic.
         * @param elementName The name (id) of the HTML element to use as the viewport. Must be the id of a canvas element.
         * */
        public start( game: IGame, elementName?: string ): void {

            this._game = game;

            let rendererViewportCreateInfo: RendererViewportCreateInfo = new RendererViewportCreateInfo();
            rendererViewportCreateInfo.elementId = elementName;
            rendererViewportCreateInfo.projectionType = ViewportProjectionType.PERSPECTIVE;
            rendererViewportCreateInfo.width = this._gameWidth;
            rendererViewportCreateInfo.height = this._gameHeight;
            rendererViewportCreateInfo.nearClip = 0.1;
            rendererViewportCreateInfo.farClip = 1000.0;
            rendererViewportCreateInfo.fov = Math.degToRad( 45.0 );
            rendererViewportCreateInfo.x = 0;
            rendererViewportCreateInfo.y = 0;

            this._renderer = new Renderer( rendererViewportCreateInfo );

            // Initialize various sub-systems.
            AssetManager.Initialize();
            ShaderManager.Initialize();
            InputManager.Initialize( this._renderer.windowViewportCanvas );

            // Load fonts
            BitmapFontManager.load();

            // Load level config
            LevelManager.load();

            // Load material configs
            MaterialManager.load();

            // Load audio. Note that this does not hold up the engine from being ready.
            AudioManager.load();

            // Trigger a resize to make sure the viewport is corrent.
            this.resize();

            // Begin the preloading phase, which waits for various thing to be loaded before starting the game.
            this.preloading();
        }

        /**
         * Resizes the canvas to fit the window.
         * */
        public resize(): void {
            if ( this._renderer ) {
                this._renderer.Resize();
            }
        }

        /**
         * The main game loop.
         */
        private loop(): void {
            if ( this._isFirstUpdate ) {

            }

            this.update();
            this.render();

            requestAnimationFrame( this.loop.bind( this ) );
        }

        private preloading(): void {

            // Make sure to always update the message bus.
            MessageBus.update( 0 );

            if ( !BitmapFontManager.isLoaded ) {
                requestAnimationFrame( this.preloading.bind( this ) );
                return;
            }

            if ( !MaterialManager.isLoaded ) {
                requestAnimationFrame( this.preloading.bind( this ) );
                return;
            }

            if ( !LevelManager.isLoaded ) {
                requestAnimationFrame( this.preloading.bind( this ) );
                return;
            }

            // Perform items such as loading the first/initial level, etc.
            this._game.UpdateReady();

            // Kick off the render loop.
            this.loop();
        }

        private update(): void {
            let delta = performance.now() - this._previousTime;

            MessageBus.update( delta );
            LevelManager.update( delta );
            CollisionManager.update( delta );

            this._game.Update( delta );

            this._previousTime = performance.now();
        }

        private render(): void {
            this._renderer.BeginRender();


            LevelManager.render( this._renderer.Projection );

            this._game.Render();

            this._renderer.EndRender();
        }
    }
}