namespace NT {

    /**
     * Represents a sound effect.
     */
    export class SoundEffect {

        private _player: HTMLAudioElement;

        /** The asset path of this effect. */
        public assetPath: string;

        /**
         * Creates a new sound effect.
         * @param assetPath The asset path of this effect.
         * @param loop Indicates if this effect should loop.
         */
        public constructor( assetPath: string, loop: boolean ) {
            this._player = new Audio( assetPath );
            this._player.loop = loop;
        }

        /** Indicates if this effect is looping. */
        public get loop(): boolean {
            return this._player.loop;
        }

        /** Sets whether or not this effect should loop. */
        public set loop( value: boolean ) {
            this._player.loop = value;
        }

        /**
         * Performs desctruction routines on this object.
         */
        public destroy(): void {
            this._player = undefined;
        }

        /**
         * Plays this effect. If called more than once or while being played, 
         * the effect is played from the beginning.
         */
        public play(): void {
            if ( !this._player.paused ) {
                this.stop();
            }
            this._player.play();
        }

        /**
         * Pauses this effect.
         */
        public pause(): void {
            this._player.pause();
        }

        /**
         * Stops this effect and resets its position to the beginning.
         */
        public stop(): void {
            this._player.pause();
            this._player.currentTime = 0;
        }
    }
}