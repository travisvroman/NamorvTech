namespace TSE {


    export class Scene {

        private _root: SimObject;

        public constructor() {
            this._root = new SimObject( 0, "__ROOT__", this );
        }

        public get root(): SimObject {
            return this._root;
        }

        public get isLoaded(): boolean {
            return this._root.isLoaded;
        }

        public addObject( object: SimObject ): void {
            this._root.addChild( object );
        }

        public getObjectByName( name: string ): SimObject {
            return this._root.getObjectByName( name );
        }

        public load(): void {
            this._root.load();
        }

        public update( time: number ): void {
            this._root.update( time );
        }

        public render( shader: Shader ): void {
            this._root.render( shader );
        }
    }
}