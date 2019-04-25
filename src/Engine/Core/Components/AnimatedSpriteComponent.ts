/// <reference path="ComponentManager.ts" />
/// <reference path="SpriteComponent.ts" />
/// <reference path="BaseComponent.ts" />

namespace NT {

    /**
     * The data for an animated sprite component. Inherited from sprite component data.
     */
    export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {

        /** The width in pixels per frame. */
        public frameWidth: number;

        /** The height in pixels per frame. */
        public frameHeight: number;

        /** The number of frames. */
        public frameCount: number;

        /** The sequence of frame indices. */
        public frameSequence: number[] = [];

        /** Indicates if this component should play automatically on load. */
        public autoPlay: boolean = true;

        /** THe amount of time in milliseconds that each frame should take to play. */
        public frameTime: number = 33;

        public setFromJson( json: any ): void {
            super.setFromJson( json );

            if ( json.autoPlay !== undefined ) {
                this.autoPlay = Boolean( json.autoPlay );
            }

            if ( json.frameWidth === undefined ) {
                throw new Error( "AnimatedSpriteComponentData requires 'frameWidth' to be defined." );
            } else {
                this.frameWidth = Number( json.frameWidth );
            }

            if ( json.frameHeight === undefined ) {
                throw new Error( "AnimatedSpriteComponentData requires 'frameHeight' to be defined." );
            } else {
                this.frameHeight = Number( json.frameHeight );
            }

            if ( json.frameCount === undefined ) {
                throw new Error( "AnimatedSpriteComponentData requires 'frameCount' to be defined." );
            } else {
                this.frameCount = Number( json.frameCount );
            }

            if ( json.frameSequence === undefined ) {
                throw new Error( "AnimatedSpriteComponentData requires 'frameSequence' to be defined." );
            } else {
                this.frameSequence = json.frameSequence;
            }

            if ( json.frameTime !== undefined ) {
                this.frameTime = Number( json.frameTime );
            }
        }
    }

    /**
     * The builder for the animated sprite component.
     */
    export class AnimatedSpriteComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "animatedSprite";
        }

        public buildFromJson( json: any ): IComponent {
            let data = new AnimatedSpriteComponentData();
            data.setFromJson( json );
            return new AnimatedSpriteComponent( data );
        }
    }

    /**
     * A special sprite component which animates by displaying a sequence of frames.
     */
    export class AnimatedSpriteComponent extends BaseComponent {

        private _autoPlay: boolean;
        private _sprite: AnimatedSprite;

        /**
         * 
         * @param data Creates a new AnimatedSpriteComponent.
         */
        public constructor( data: AnimatedSpriteComponentData ) {
            super( data );

            this._autoPlay = data.autoPlay;

            let spriteInfo = new AnimatedSpriteInfo();
            spriteInfo.name = name;
            spriteInfo.materialName = data.materialName;
            spriteInfo.frameWidth = data.frameWidth;
            spriteInfo.frameHeight = data.frameHeight;
            spriteInfo.width = data.frameWidth;
            spriteInfo.height = data.frameHeight;
            spriteInfo.frameCount = data.frameCount
            spriteInfo.frameSequence = data.frameSequence;
            spriteInfo.frameTime = data.frameTime;

            this._sprite = new AnimatedSprite( spriteInfo );
            if ( !data.origin.equals( Vector3.zero ) ) {
                this._sprite.origin.copyFrom( data.origin );
            }
        }

        /** Indicates if this component is currently playing.  */
        public get isPlaying(): boolean {
            return this._sprite.isPlaying;
        }

        /** Performs loading routines on this component. */
        public load(): void {
            this._sprite.load();
        }

        /** Performs pre-update procedures on this component */
        public updateReady(): void {
            if ( !this._autoPlay ) {
                this._sprite.stop();
            }
        }

        /**
         * Performs update routines on this component.
         * @param time The amount of time in milliseconds since the last update.
         */
        public update( time: number ): void {
            this._sprite.update( time );

            super.update( time );
        }

        /**
         * Performs rendering procedures on this component.
         */
        public render( renderView: RenderView ): void {
            this._sprite.draw( this.owner.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix );

            super.render( renderView );
        }

        /** Plays the animation this component. */
        public play(): void {
            this._sprite.play();
        }

        /** Stops the animation of this component. */
        public stop(): void {
            this._sprite.stop();
        }

        /**
         * Sets the current frame to the index provided.
         * @param frameNumber The frame number to be set.
         */
        public setFrame( frameNumber: number ): void {
            this._sprite.setFrame( frameNumber );
        }
    }

    ComponentManager.registerBuilder( new AnimatedSpriteComponentBuilder() );
}