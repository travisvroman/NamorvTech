namespace TSE {


    export interface IBehavior {
        name: string;

        setOwner( owner: SimObject ): void;

        updateReady(): void;

        update( time: number ): void;

        apply( userData: any ): void;
    }
}