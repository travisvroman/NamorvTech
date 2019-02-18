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

        private _isFirstUpdate: boolean = true;
        private _aspect: number;

        /**
         * Creates a new engine.
         * @param width The width of the game in pixels.
         * @param height The height of the game in pixels.
         * */
        public constructor(width?: number, height?: number) {
            this._gameWidth = width;
            this._gameHeight = height;
        }

        /**
         * Starts up this engine.
         * */
        public start(elementName?: string): void {

            this._canvas = GLUtilities.initialize(elementName);
            if (this._gameWidth !== undefined && this._gameHeight !== undefined) {
                this._aspect = this._gameWidth / this._gameHeight;
            }
            AssetManager.initialize();
            InputManager.initialize(this._canvas);
            ZoneManager.initialize();

            gl.clearColor(146 / 255, 206 / 255, 247 / 255, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // Load fonts
            BitmapFontManager.addFont("default", "assets/fonts/text.txt");
            BitmapFontManager.load();

            // Load materials
            MaterialManager.registerMaterial(new Material("bg", "assets/textures/bg.png", Color.white()));
            MaterialManager.registerMaterial(new Material("end", "assets/textures/end.png", Color.white()));
            MaterialManager.registerMaterial(new Material("middle", "assets/textures/middle.png", Color.white()));
            MaterialManager.registerMaterial(new Material("grass", "assets/textures/grass.png", Color.white()));
            MaterialManager.registerMaterial(new Material("duck", "assets/textures/duck.png", Color.white()));

            MaterialManager.registerMaterial(new Material("playbtn", "assets/textures/playbtn.png", Color.white()));
            MaterialManager.registerMaterial(new Material("restartbtn", "assets/textures/restartbtn.png", Color.white()));
            MaterialManager.registerMaterial(new Material("score", "assets/textures/score.png", Color.white()));
            MaterialManager.registerMaterial(new Material("title", "assets/textures/title.png", Color.white()));
            MaterialManager.registerMaterial(new Material("tutorial", "assets/textures/tutorial.png", Color.white()));

            AudioManager.loadSoundFile("flap", "assets/sounds/flap.mp3", false);
            AudioManager.loadSoundFile("ting", "assets/sounds/ting.mp3", false);
            AudioManager.loadSoundFile("dead", "assets/sounds/dead.mp3", false);

            // Load
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100.0, 100.0);

            this.resize();

            // Begin the preloading phase, which waits for various thing to be loaded before starting the game.
            this.preloading();
        }

        /**
         * Resizes the canvas to fit the window.
         * */
        public resize(): void {
            if (this._canvas !== undefined) {
                if (this._gameWidth === undefined || this._gameHeight === undefined) {
                    this._canvas.width = window.innerWidth;
                    this._canvas.height = window.innerHeight;
                    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
                    this._projection = Matrix4x4.orthographic(0, window.innerWidth, window.innerHeight, 0, -100.0, 100.0);
                } else {
                    let newWidth = window.innerWidth;
                    let newHeight = window.innerHeight;
                    let newWidthToHeight = newWidth / newHeight;
                    let gameArea = document.getElementById("gameArea");

                    if (newWidthToHeight > this._aspect) {
                        newWidth = newHeight * this._aspect;
                        gameArea.style.height = newHeight + 'px';
                        gameArea.style.width = newWidth + 'px';
                    } else {
                        newHeight = newWidth / this._aspect;
                        gameArea.style.width = newWidth + 'px';
                        gameArea.style.height = newHeight + 'px';
                    }

                    gameArea.style.marginTop = (-newHeight / 2) + 'px';
                    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

                    this._canvas.width = newWidth;
                    this._canvas.height = newHeight;

                    gl.viewport(0, 0, newWidth, newHeight);
                    this._projection = Matrix4x4.orthographic(0, this._gameWidth, this._gameHeight, 0, -100.0, 100.0);

                    let resolutionScale = new Vector2(newWidth / this._gameWidth, newHeight / this._gameHeight);
                    InputManager.setResolutionScale(resolutionScale);
                }
            }
        }

        public onMessage(message: Message): void {
            if (message.code === "MOUSE_UP") {
                let context = message.context as MouseContext;
                document.title = `Pos: [${context.position.x},${context.position.y}]`;
            }
        }

        private loop(): void {
            if (this._isFirstUpdate) {

            }

            this.update();
            this.render();

            requestAnimationFrame(this.loop.bind(this));
        }

        private preloading(): void {

            // Make sure to always update the message bus.
            MessageBus.update(0);

            if (!BitmapFontManager.updateReady()) {
                requestAnimationFrame(this.preloading.bind(this));
                return;
            }

            // Load up our zone. TODO: make this configurable.
            ZoneManager.changeZone(0);

            // Kick off the render loop.
            this.loop();
        }

        private update(): void {
            let delta = performance.now() - this._previousTime;

            MessageBus.update(delta);
            ZoneManager.update(delta);
            CollisionManager.update(delta);

            this._previousTime = performance.now();
        }

        private render(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            ZoneManager.render(this._basicShader);
            // Set uniforms.
            let projectionPosition = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));

        }
    }
}