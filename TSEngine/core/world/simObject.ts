namespace TSE {


    export class SimObject {

        private _id: number;
        private _children: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _scene: Scene;
        private _components: BaseComponent[] = [];

        private _localMatrix: Matrix4x4 = Matrix4x4.identity();
        private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

        public name: string;

        public transform: Transform = new Transform();


        public constructor( id: number, name: string, scene?: Scene ) {
            this._id = id;
            this.name = name;
            this._scene = scene;
        }

        public get id(): number {
            return this._id;
        }

        public get parent(): SimObject {
            return this._parent;
        }

        public get worldMatrix(): Matrix4x4 {
            return this._worldMatrix;
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public addChild( child: SimObject ): void {
            child._parent = this;
            this._children.push( child );
            child.onAdded( this._scene );
        }

        public removeChild( child: SimObject ): void {
            let index = this._children.indexOf( child );
            if ( index !== -1 ) {
                child._parent = undefined;
                this._children.splice( index, 1 );
            }
        }

        public getObjectByName( name: string ): SimObject {
            if ( this.name === name ) {
                return this;
            }

            for ( let child of this._children ) {
                let result = child.getObjectByName( name );
                if ( result !== undefined ) {
                    return result;
                }
            }

            return undefined;
        }

        public addComponent( component: BaseComponent ): void {
            this._components.push( component );
            component.setOwner( this );
        }

        public load(): void {
            this._isLoaded = true;

            for ( let c of this._components ) {
                c.load();
            }

            for ( let c of this._children ) {
                c.load();
            }
        }

        public update( time: number ): void {

            this._localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix( ( this._parent !== undefined ) ? this._parent.worldMatrix : undefined );

            for ( let c of this._components ) {
                c.update( time );
            }

            for ( let c of this._children ) {
                c.update( time );
            }
        }

        public render( shader: Shader ): void {
            for ( let c of this._components ) {
                c.render( shader );
            }

            for ( let c of this._children ) {
                c.render( shader );
            }
        }

        protected onAdded( scene: Scene ): void {
            this._scene = scene;
        }

        private updateWorldMatrix( parentWorldMatrix: Matrix4x4 ): void {
            if ( parentWorldMatrix !== undefined ) {
                this._worldMatrix = Matrix4x4.multiply( parentWorldMatrix, this._localMatrix );
            } else {
                this._worldMatrix.copyFrom( this._localMatrix );
            }
        }
    }
}