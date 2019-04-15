namespace NT {

    /**
     * A dictionary which uses a string key type.
     */
    export type Dictionary<T> = { [key: string]: T };

    /**
     * A dictionary which uses a number key type.
     */
    export type NumericDictionary<T> = { [key: number]: T };
}