namespace NT {

    /** A builder which is used for component creation. */
    export interface IComponentBuilder {

        /** The type of component. */
        readonly type: string;

        /**
         * Builds a compoent from the provided json.
         * @param json The json to build from.
         */
        buildFromJson( json: any ): IComponent;
    }
}