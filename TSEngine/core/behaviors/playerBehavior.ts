/// <reference path="basebehavior.ts" />
/// <reference path="behaviormanager.ts" />

namespace TSE {

    export class PlayerBehaviorData implements IBehaviorData {
        public name: string;
        public acceleration: Vector2 = new Vector2(0, 920);
        public playerCollisionComponent: string;
        public groundCollisionComponent: string;
        public animatedSpriteName: string;
        public scoreCollisionComponent: string;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in behavior data.");
            }

            this.name = String(json.name);

            if (json.acceleration !== undefined) {
                this.acceleration.setFromJson(json.acceleration);
            }

            if (json.animatedSpriteName === undefined) {
                throw new Error("animatedSpriteName must be defined in behavior data.");
            } else {
                this.animatedSpriteName = String(json.animatedSpriteName);
            }

            if (json.playerCollisionComponent === undefined) {
                throw new Error("playerCollisionComponent must be defined in behavior data.");
            } else {
                this.playerCollisionComponent = String(json.playerCollisionComponent);
            }

            if (json.groundCollisionComponent === undefined) {
                throw new Error("groundCollisionComponent must be defined in behavior data.");
            } else {
                this.groundCollisionComponent = String(json.groundCollisionComponent);
            }

            if (json.scoreCollisionComponent === undefined) {
                throw new Error("scoreCollisionComponent must be defined in behavior data.");
            } else {
                this.scoreCollisionComponent = String(json.scoreCollisionComponent);
            }
        }
    }

    export class PlayerBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "player";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new PlayerBehaviorData();
            data.setFromJson(json);
            return new PlayerBehavior(data);
        }
    }

    export class PlayerBehavior extends BaseBehavior implements IMessageHandler {


        private _acceleration: Vector2;
        private _velocity: Vector2 = Vector2.zero;
        private _isAlive: boolean = true;
        private _playerCollisionComponent: string;
        private _groundCollisionComponent: string;
        private _scoreCollisionComponent: string;
        private _animatedSpriteName: string;
        private _isPlaying: boolean = false;
        private _initialPosition: Vector3 = Vector3.zero;
        private _score: number = 0;
        private _highScore: number = 0;

        private _sprite: AnimatedSpriteComponent;

        // TODO: move this to configuration.
        private _pipeNames: string[] = ["pipe1Collision_end", "pipe1Collision_middle_top", "pipe1Collision_endneg", "pipe1Collision_middle_bottom"];

        public constructor(data: PlayerBehaviorData) {
            super(data);

            this._acceleration = data.acceleration;
            this._playerCollisionComponent = data.playerCollisionComponent;
            this._groundCollisionComponent = data.groundCollisionComponent;
            this._scoreCollisionComponent = data.scoreCollisionComponent;
            this._animatedSpriteName = data.animatedSpriteName;

            Message.subscribe("MOUSE_DOWN", this);
            Message.subscribe("COLLISION_ENTRY", this);

            Message.subscribe("GAME_READY", this);
            Message.subscribe("GAME_RESET", this);
            Message.subscribe("GAME_START", this);

            Message.subscribe("PLAYER_DIED", this);
        }

        public updateReady(): void {
            super.updateReady();

            // Obtain a reference to the animated sprite.
            this._sprite = this._owner.getComponentByName(this._animatedSpriteName) as AnimatedSpriteComponent;
            if (this._sprite === undefined) {
                throw new Error("AnimatedSpriteComponent named '" + this._animatedSpriteName +
                    "' is not attached to the owner of this component.");
            }

            // Make sure the animation plays right away.
            this._sprite.setFrame(0);

            this._initialPosition.copyFrom(this._owner.transform.position);
        }

        public update(time: number): void {

            let seconds: number = time / 1000;

            if (this._isPlaying) {
                this._velocity.add(this._acceleration.clone().scale(seconds));
            }

            // Limit max speed
            if (this._velocity.y > 400) {
                this._velocity.y = 400;
            }

            // Prevent flying too high.
            if (this._owner.transform.position.y < -13) {
                this._owner.transform.position.y = -13;
                this._velocity.y = 0;
            }

            this._owner.transform.position.add(this._velocity.clone().scale(seconds).toVector3());

            if (this._velocity.y < 0) {
                this._owner.transform.rotation.z -= Math.degToRad(600.0) * seconds;
                if (this._owner.transform.rotation.z < Math.degToRad(-20)) {
                    this._owner.transform.rotation.z = Math.degToRad(-20);
                }
            }

            if (this.isFalling() || !this._isAlive) {
                this._owner.transform.rotation.z += Math.degToRad(480.0) * seconds;
                if (this._owner.transform.rotation.z > Math.degToRad(90)) {
                    this._owner.transform.rotation.z = Math.degToRad(90);
                }
            }

            if (this.shouldNotFlap()) {
                this._sprite.stop();
            } else {
                if (!this._sprite.isPlaying) {
                    this._sprite.play();
                }
            }

            super.update(time);
        }

        public onMessage(message: Message): void {
            switch (message.code) {
                case "MOUSE_DOWN":
                    this.onFlap();
                    break;
                case "COLLISION_ENTRY":
                    let data: CollisionData = message.context as CollisionData;
                    if (data.a.name !== this._playerCollisionComponent && data.b.name !== this._playerCollisionComponent) {
                        return;
                    }
                    if (data.a.name === this._groundCollisionComponent || data.b.name === this._groundCollisionComponent) {
                        this.die();
                        this.decelerate();
                    } else if (this._pipeNames.indexOf(data.a.name) !== -1 || this._pipeNames.indexOf(data.b.name) !== -1) {
                        this.die();
                    } else if (data.a.name === this._scoreCollisionComponent || data.b.name === this._scoreCollisionComponent) {
                        if (this._isAlive && this._isPlaying) {
                            this.setScore(this._score + 1);
                            AudioManager.playSound("ting");
                        }
                    }
                    break;

                // Shows the tutorial, click to GAME_START
                case "GAME_RESET":
                    Message.send("GAME_HIDE", this);
                    Message.send("RESET_HIDE", this);
                    Message.send("SPLASH_HIDE", this);
                    Message.send("TUTORIAL_SHOW", this);
                    this.reset();
                    break;

                // Starts the main game.
                case "GAME_START":
                    Message.send("GAME_SHOW", this);
                    Message.send("RESET_HIDE", this);
                    Message.send("SPLASH_HIDE", this);
                    Message.send("TUTORIAL_HIDE", this);
                    this._isPlaying = true;
                    this._isAlive = true;
                    this.start();
                    break;

                // Zone is loaded, show play button/splash screen
                case "GAME_READY":
                    Message.send("RESET_HIDE", this);
                    Message.send("TUTORIAL_HIDE", this);
                    Message.send("GAME_HIDE", this);
                    Message.send("SPLASH_SHOW", this);
                    break;

                // Show score and restart button
                case "PLAYER_DIED":
                    Message.send("RESET_SHOW", this);
                    break;
            }
        }

        private isFalling(): boolean {
            return this._velocity.y > 220.0;
        }

        private shouldNotFlap(): boolean {
            return !this._isPlaying || this._velocity.y > 220.0 || !this._isAlive;
        }

        private die(): void {
            if (this._isAlive) {
                this._isAlive = false;
                AudioManager.playSound("dead");
                Message.send("PLAYER_DIED", this);
            }
        }

        private reset(): void {
            this._isAlive = true;
            this._isPlaying = false;
            this._sprite.owner.transform.position.copyFrom(this._initialPosition);
            this._sprite.owner.transform.rotation.z = 0;
            this.setScore(0);

            this._velocity.set(0, 0);
            this._acceleration.set(0, 920);
            this._sprite.play();
        }

        private start(): void {
            this._isPlaying = true;
            Message.send("PLAYER_RESET", this);
        }

        private decelerate(): void {
            this._acceleration.y = 0;
            this._velocity.y = 0;
        }

        private onFlap(): void {
            if (this._isAlive && this._isPlaying) {
                this._velocity.y = -280;
                AudioManager.playSound("flap");
            }
        }

        private setScore(score: number): void {
            this._score = score;
            Message.send("counterText:SetText", this, this._score);
            Message.send("scoreText:SetText", this, this._score);

            if (this._score > this._highScore) {
                this._highScore = this._score;
                Message.send("bestText:SetText", this, this._highScore);
            }
        }
    }

    BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());
}