namespace NT {

    export interface IComponentData {
        name: string;

        setFromJson( json: any ): void;
    }
}