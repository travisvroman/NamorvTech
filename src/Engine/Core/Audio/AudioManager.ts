namespace NT {

    /** Represents the configuration for a audio file. These are typically created and stored in a audio config file. */
    class AudioConfig {

        /** The name of this audio. */
        public name: string;

        /** The audio file path of this audio config. */
        public audioFile: string;

        /** Indicates if this audio effect will loop. */
        public loop: boolean = false;

        /**
         * Creates a AudioConfig from the provided JSON.
         * @param json The JSON to create from.
         */
        public static fromJson( json: any ): AudioConfig {
            let config = new AudioConfig();
            if ( json.name !== undefined ) {
                config.name = String( json.name );
            }

            if ( json.loop !== undefined ) {
                config.loop = Boolean( json.loop );
            }

            if ( json.audioFile !== undefined ) {
                config.audioFile = String( json.audioFile );
            } else {
                throw new Error( "Cannot create a audio config without a audioFile." );
            }

            return config;
        }
    }

    /**
     * Manages various aspects of audio output.
     */
    export class AudioManager {

        private static _configLoaded: boolean = false;
        private static _soundEffects: { [name: string]: SoundEffect } = {};

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public static onMessage( message: Message ): void {

            // TODO: one for each asset.
            if ( message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/audio/audio.json" ) {
                Message.unsubscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/audio/audio.json",
                    AudioManager.onMessage );

                AudioManager.processAudioConfigAsset( message.context as JsonAsset );
            }
        }

        /**
         * Loads registered audio.
         */
        public static load(): void {

            // Get the asset(s). TODO: This probably should come from a central asset manifest.
            let asset = AssetManager.getAsset( "assets/audio/audio.json" );
            if ( asset !== undefined ) {
                AudioManager.processAudioConfigAsset( asset as JsonAsset );
            } else {

                // Listen for the message that the file has loaded.
                Message.subscribeCallback( MESSAGE_ASSET_LOADER_ASSET_LOADED + "assets/audio/audio.json",
                    AudioManager.onMessage );
            }
        }

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

        private static processAudioConfigAsset( asset: JsonAsset ): void {

            let configs = asset.Data.soundEffects;
            if ( configs ) {
                for ( let config of configs ) {
                    let a = AudioConfig.fromJson( config );
                    AudioManager.loadSoundFile( a.name, a.audioFile, a.loop );
                }
            }

            // TODO: Should only set this if ALL queued assets have loaded.
            AudioManager._configLoaded = true;
        }
    }
}