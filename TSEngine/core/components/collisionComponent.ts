/// <reference path="componentmanager.ts" />
/// <reference path="basecomponent.ts" />

namespace TSE {

    export class CollisionComponentData implements IComponentData {
        public name: string;
        public shape: IShape2D;

        public setFromJson( json: any ): void {
            if ( json.name !== undefined ) {
                this.name = String( json.name );
            }

            if ( json.shape === undefined ) {
                throw new Error( "CollisionComponentData requires 'shape' to be present." );
            } else {
                if ( json.shape.type === undefined ) {
                    throw new Error( "CollisionComponentData requires 'shape.type' to be present." );
                }

                let shapeType: string = String( json.shape.type ).toLowerCase();
                switch ( shapeType ) {
                    case "rectangle":
                        this.shape = new Rectangle2D();
                        break;
                    case "circle":
                        this.shape = new Circle2D();
                        break;
                    default:
                        throw new Error( "Unsupported shape type: '" + shapeType + "'." );
                }

                this.shape.setFromJson( json.shape );
            }
        }
    }

    export class CollisionComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "collision";
        }

        public buildFromJson( json: any ): IComponent {
            let data = new CollisionComponentData();
            data.setFromJson( json );
            return new CollisionComponent( data );
        }
    }

    export class CollisionComponent extends BaseComponent {

        private _shape: IShape2D;

        public constructor( data: CollisionComponentData ) {
            super( data );

            this._shape = data.shape;
        }

        public get shape(): IShape2D {
            return this._shape;
        }

        public load(): void {
            super.load();

            // TODO: need to get world position for nested objects.
            this._shape.position.copyFrom( this.owner.transform.position.toVector2().add( this._shape.offset ) );

            // Tell the collision manager that we exist.
            CollisionManager.registerCollisionComponent( this );
        }

        public update( time: number ): void {

            // TODO: need to get world position for nested objects.
            this._shape.position.copyFrom( this.owner.transform.position.toVector2().add( this._shape.offset ) );

            super.update( time );
        }

        public render( shader: Shader ): void {
            //this._sprite.draw( shader, this.owner.worldMatrix );

            super.render( shader );
        }

        public onCollisionEntry( other: CollisionComponent ): void {
            console.log( "onCollisionEntry:", this, other );
        }

        public onCollisionUpdate( other: CollisionComponent ): void {
            console.log( "onCollisionUpdate:", this, other );
        }

        public onCollisionExit( other: CollisionComponent ): void {
            console.log( "onCollisionExit:", this, other );
        }
    }

    ComponentManager.registerBuilder( new CollisionComponentBuilder() );
}