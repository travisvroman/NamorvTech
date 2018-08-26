namespace TSE {


    export enum ZoneState {
        UNINITIALIZED,
        LOADING,
        UPDATING
    }



    export class Zone {

        private _id: number;
        private _name: string;
        private _description: string;
        private _scene: Scene;
        private _state: ZoneState = ZoneState.UNINITIALIZED;

        public constructor( id: number, name: string, description: string ) {
            this._id = id;
            this._name = name;
            this._description = description;
            this._scene = new Scene();
        }


        public get id(): number {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }

        public get description(): string {
            return this._description;
        }

        public get scene(): Scene {
            return this._scene;
        }

        public load(): void {
            this._state = ZoneState.LOADING;

            this._scene.load();

            this._state = ZoneState.UPDATING;
        }

        public unload(): void {

        }

        public update( time: number ): void {
            if ( this._state === ZoneState.UPDATING ) {
                this._scene.update( time );
            }
        }

        public render( shader: Shader ): void {
            if ( this._state === ZoneState.UPDATING ) {
                this._scene.render( shader );
            }
        }

        public onActivated(): void {

        }

        public onDeactivated(): void {

        }
    }
}