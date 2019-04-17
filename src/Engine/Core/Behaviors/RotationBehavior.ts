/// <reference path="BaseBehavior.ts" />
/// <reference path="BehaviorManager.ts" />

namespace NT {

    /**
     * The data for a rotation behavior.
     */
    export class RotationBehaviorData implements IBehaviorData {

        /** The name of the behavior. */
        public name: string;

        /** The rotation amounts to be added per update. */
        public rotation: Vector3 = Vector3.zero;

        /**
         * Sets the properties of this data from the provided json.
         * @param json The json to set from.
         */
        public setFromJson( json: any ): void {
            if ( json.name === undefined ) {
                throw new Error( "Name must be defined in behavior data." );
            }

            this.name = String( json.name );

            if ( json.rotation !== undefined ) {
                this.rotation.setFromJson( json.rotation );
            }
        }
    }

    /** The builder for a rotation behavior. */
    export class RotationBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "rotation";
        }

        public buildFromJson( json: any ): IBehavior {
            let data = new RotationBehaviorData();
            data.setFromJson( json );
            return new RotationBehavior( data );
        }
    }

    /**
     * A behavior which continuously rotates the object to which it is attached by the
     * configured amount.
     */
    export class RotationBehavior extends BaseBehavior {

        private _rotation: Vector3;

        /**
         * Creates a new RotationBehavior.
         * @param data The data for this behavior.
         */
        public constructor( data: RotationBehaviorData ) {
            super( data );

            this._rotation = data.rotation;
        }

        /**
         * Performs update procedures on this behavior.
         * @param time The time in milliseconds since the last update.
         */
        public update( time: number ): void {
            this._owner.transform.rotation.add( this._rotation );

            super.update( time );
        }
    }

    BehaviorManager.registerBuilder( new RotationBehaviorBuilder() );
}