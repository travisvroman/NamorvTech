namespace NT {

    /** Represents an asset */
    export interface IAsset {

        /** The name of this asset. */
        readonly Name: string;

        /** The data of this asset. */
        readonly Data: any;
    }
}