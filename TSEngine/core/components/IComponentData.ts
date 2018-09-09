namespace TSE {

    export interface IComponentData {
        name: string;

        setFromJson( json: any ): void;
    }
}