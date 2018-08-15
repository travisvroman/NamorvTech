namespace TSE {

    /** Represents an asset */
    export interface IAsset {

        /** The name of this asset. */
        readonly name: string;

        /** The data of this asset. */
        readonly data: any;
    }
}