/// <reference path="BaseBehavior.ts" />
/// <reference path="BehaviorManager.ts" />

namespace NT {

    /**
     * Represents the data used to configure this behavior.
     */
    export class KeyboardMovementBehaviorData implements IBehaviorData {

        /**
         * The name of this behavior.
         */
        public name: string;

        /**
         * The movement speed to be applied when a key is held down. Default: 0.1
         */
        public speed: number = 0.1;

        /**
         * Sets the properties of this data from the provided JSON.
         * @param json The json to set from.
         */
        public setFromJson( json: any ): void {
            if ( json.name === undefined ) {
                throw new Error( "Name must be defined in behavior data." );
            }

            this.name = String( json.name );

            if ( json.speed !== undefined ) {
                this.speed = Number( json.speed );
            }
        }
    }

    /**
     * The builder for a KeyboardMovement behavior.
     */
    export class KeyboardMovementBehaviorBuilder implements IBehaviorBuilder {

        /**
         * The behavior type.
         */
        public get type(): string {
            return "keyboardMovement";
        }

        /**
         * Builds a behavior from the provided json.
         * @param json The json to build from.
         */
        public buildFromJson( json: any ): IBehavior {
            let data = new KeyboardMovementBehaviorData();
            data.setFromJson( json );
            return new KeyboardMovementBehavior( data );
        }
    }

    /**
     * A behavior which, when a key is held down, moves the object to which it is attached
     * at the rate of the configured speed.
     */
    export class KeyboardMovementBehavior extends BaseBehavior {

        /**
         * The speed a which to move.
         */
        public speed: number = 0.1; 

        /**
         * Creates a new KeyboardMovementBehavior.
         * @param data The data for this behavior.
         */
        public constructor( data: KeyboardMovementBehaviorData ) {
            super( data );

            this.speed = data.speed;
        }

        /**
         * Performs update procedures on this component.
         * @param time The delta time in milliseconds since the last update.
         */
        public update( time: number ): void {
            if ( InputManager.isKeyDown( Keys.LEFT ) ) {
                this._owner.transform.position.x -= this.speed;
            }
            if ( InputManager.isKeyDown( Keys.RIGHT ) ) {
                this._owner.transform.position.x += this.speed;
            }
            if ( InputManager.isKeyDown( Keys.UP ) ) {
                this._owner.transform.position.y -= this.speed;
            }
            if ( InputManager.isKeyDown( Keys.DOWN ) ) {
                this._owner.transform.position.y += this.speed;
            }

            super.update( time );
        }
    }

    // Auto-registers the builder.
    BehaviorManager.registerBuilder( new KeyboardMovementBehaviorBuilder() );
}