namespace TSE {


    export interface IBehaviorBuilder {
        readonly type: string;
        buildFromJson( json: any ): IBehavior;
    }
}