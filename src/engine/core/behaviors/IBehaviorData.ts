namespace NT {

    /**
     * Represents data which is used to construct behaviors.
     */
    export interface IBehaviorData {

        /**
         * The name of this behavior.
         */
        name: string;

        /**
         * Sets the properties of this data from the provided json.
         * @param json The json to set from.
         */
        setFromJson( json: any ): void;
    }
}