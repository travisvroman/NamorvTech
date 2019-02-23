namespace NT {

    /**
     * Manages various aspects of audio output.
     */
    export class AudioManager {

        private static _soundEffects: { [name: string]: SoundEffect } = {};

        /**
         * Loads a sound file and creates a sound effect, registering it with this manager.
         * @param name The name of the sound effect to be loaded.
         * @param assetPath The path of the sound file to load.
         * @param loop Indicates if the effect should loop.
         */
        public static loadSoundFile( name: string, assetPath: string, loop: boolean ): void {
            AudioManager._soundEffects[name] = new SoundEffect( assetPath, loop );
        }

        /**
         * Plays a sound effect with the given name.
         * @param name The name of the sound to be played.
         */
        public static playSound( name: string ): void {
            if ( AudioManager._soundEffects[name] !== undefined ) {
                AudioManager._soundEffects[name].play();
            }
        }

        /**
         * Pauses a sound effect with the given name.
         * @param name The name of the sound to be paused.
         */
        public static pauseSound( name: string ): void {
            if ( AudioManager._soundEffects[name] !== undefined ) {
                AudioManager._soundEffects[name].pause();
            }
        }

        /**
         * Pauses all sound effects.
         */
        public static pauseAll(): void {
            for ( let sfx in AudioManager._soundEffects ) {
                AudioManager._soundEffects[sfx].pause();
            }
        }

        /**
         * Stops a sound effect with the given name.
         * @param name The name of the sound to be stopped.
         */
        public static stopSound( name: string ): void {
            if ( AudioManager._soundEffects[name] !== undefined ) {
                AudioManager._soundEffects[name].stop();
            }
        }

        /**
         * Stops all sound effects.
         */
        public static stopAll(): void {
            for ( let sfx in AudioManager._soundEffects ) {
                AudioManager._soundEffects[sfx].stop();
            }
        }
    }
}