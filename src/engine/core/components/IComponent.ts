namespace TSE {

    export interface IComponent {

        name: string;

        readonly owner: SimObject;
        setOwner( owner: SimObject ): void;

        updateReady(): void;

        load(): void;

        update( time: number ): void;

        render( shader: Shader ): void;
    }
}