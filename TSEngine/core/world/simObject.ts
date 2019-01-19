namespace TSE {


    export class SimObject {

        private _id: number;
        private _children: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _isVisible: boolean = true;
        private _scene: Scene;
        private _components: IComponent[] = [];
        private _behaviors: IBehavior[] = [];

        private _localMatrix: Matrix4x4 = Matrix4x4.identity();
        private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

        public name: string;

        public transform: Transform = new Transform();


        public constructor(id: number, name: string, scene?: Scene) {
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

        public get isVisible(): boolean {
            return this._isVisible;
        }

        public set isVisible(value: boolean) {
            this._isVisible = value;
        }

        public addChild(child: SimObject): void {
            child._parent = this;
            this._children.push(child);
            child.onAdded(this._scene);
        }

        public removeChild(child: SimObject): void {
            let index = this._children.indexOf(child);
            if (index !== -1) {
                child._parent = undefined;
                this._children.splice(index, 1);
            }
        }

        public getComponentByName(name: string): IComponent {
            for (let component of this._components) {
                if (component.name === name) {
                    return component;
                }
            }

            for (let child of this._children) {
                let component = child.getComponentByName(name);
                if (component !== undefined) {
                    return component;
                }
            }

            return undefined;
        }

        public getBehaviorByName(name: string): IBehavior {
            for (let behavior of this._behaviors) {
                if (behavior.name === name) {
                    return behavior;
                }
            }

            for (let child of this._children) {
                let behavior = child.getBehaviorByName(name);
                if (behavior !== undefined) {
                    return behavior;
                }
            }

            return undefined;
        }

        public getObjectByName(name: string): SimObject {
            if (this.name === name) {
                return this;
            }

            for (let child of this._children) {
                let result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }

            return undefined;
        }

        public addComponent(component: IComponent): void {
            this._components.push(component);
            component.setOwner(this);
        }

        public addBehavior(behavior: IBehavior): void {
            this._behaviors.push(behavior);
            behavior.setOwner(this);
        }

        public load(): void {
            this._isLoaded = true;

            for (let c of this._components) {
                c.load();
            }

            for (let c of this._children) {
                c.load();
            }
        }

        public updateReady(): void {
            for (let c of this._components) {
                c.updateReady();
            }

            for (let b of this._behaviors) {
                b.updateReady();
            }

            for (let c of this._children) {
                c.updateReady();
            }
        }

        public update(time: number): void {

            this._localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this._parent !== undefined) ? this._parent.worldMatrix : undefined);

            for (let c of this._components) {
                c.update(time);
            }

            for (let b of this._behaviors) {
                b.update(time);
            }

            for (let c of this._children) {
                c.update(time);
            }
        }

        public render(shader: Shader): void {
            if (!this._isVisible) {
                return;
            }

            for (let c of this._components) {
                c.render(shader);
            }

            for (let c of this._children) {
                c.render(shader);
            }
        }

        public getWorldPosition(): Vector3 {
            return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14]);
        }

        protected onAdded(scene: Scene): void {
            this._scene = scene;
        }

        private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
            if (parentWorldMatrix !== undefined) {
                this._worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this._localMatrix);
            } else {
                this._worldMatrix.copyFrom(this._localMatrix);
            }
        }
    }
}