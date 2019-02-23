namespace NT {

    /**
     * An interface for a behavior builder.
     */
    export interface IBehaviorBuilder {

        /**
         * The type of behavior this builder... builds.
         */
        readonly type: string;

        /**
         * Builds a behavior from the provided json.
         * @param json The json to build from.
         */
        buildFromJson( json: any ): IBehavior;
    }
}