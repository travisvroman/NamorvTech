namespace NT {

    /**
     * Manages behaviors in the system.
     */
    export class BehaviorManager {
        private static _registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

        /**
         * Registers a given builder with this manager.
         * @param builder The builder to be registered.
         */
        public static registerBuilder( builder: IBehaviorBuilder ): void {
            BehaviorManager._registeredBuilders[builder.type] = builder;
        }

        /**
         * Attempts to extract a behavior from the provided json.
         * @param json The json to extract a behavior from.
         */
        public static extractBehavior( json: any ): IBehavior {
            if ( json.type !== undefined ) {
                if ( BehaviorManager._registeredBuilders[String( json.type )] !== undefined ) {
                    return BehaviorManager._registeredBuilders[String( json.type )].buildFromJson( json );
                }

                throw new Error( "Behavior manager error - type is missing or builder is not registered for this type." );
            }
        }
    }
}