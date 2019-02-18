namespace NT {

    export interface IComponentBuilder {

        readonly type: string;

        buildFromJson( json: any ): IComponent;
    }
}