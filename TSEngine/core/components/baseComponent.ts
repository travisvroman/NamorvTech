namespace TSE {


    export abstract class BaseComponent implements IComponent {

        protected _owner: SimObject;
        protected _data: IComponentData;

        public name: string;


        public constructor( data: IComponentData ) {
            this._data = data;
            this.name = data.name;
        }

        public get owner(): SimObject {
            return this._owner;
        }

        public setOwner( owner: SimObject ): void {
            this._owner = owner;
        }

        public load(): void {
        }

        public updateReady(): void {
        }

        public update( time: number ): void {
        }

        public render( shader: Shader ): void {
        }
    }
}