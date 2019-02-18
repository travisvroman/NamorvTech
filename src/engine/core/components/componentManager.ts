namespace NT {

    /**
     * Manages components and their creation.
     */
    export class ComponentManager {

        private static _registeredBuilders: { [type: string]: IComponentBuilder } = {};

        /**
         * Registers the provided builder.
         * @param builder The builder to register.
         */
        public static registerBuilder( builder: IComponentBuilder ): void {
            ComponentManager._registeredBuilders[builder.type] = builder;
        }

        /**
         * Extracts a component from the provided json.
         * @param json The json to extract from.
         */
        public static extractComponent( json: any ): IComponent {
            if ( json.type !== undefined ) {
                if ( ComponentManager._registeredBuilders[String( json.type )] !== undefined ) {
                    return ComponentManager._registeredBuilders[String( json.type )].buildFromJson( json );
                }

                throw new Error( "Component manager error - type is missing or builder is not registered for this type." );
            }
        }
    }
}