/// <reference path="ComponentManager.ts" />
/// <reference path="BaseComponent.ts" />

namespace NT {

    /**
     * The data for a sprite component.
     */
    export class SpriteComponentData implements IComponentData {
        public name: string;
        public materialName: string;
        public origin: Vector3 = Vector3.zero;
        public width: number;
        public height: number;

        public setFromJson( json: any ): void {
            if ( json.name !== undefined ) {
                this.name = String( json.name );
            }

            if ( json.width !== undefined ) {
                this.width = Number( json.width );
            }

            if ( json.height !== undefined ) {
                this.height = Number( json.height );
            }

            if ( json.materialName !== undefined ) {
                this.materialName = String( json.materialName );
            }

            if ( json.origin !== undefined ) {
                this.origin.setFromJson( json.origin );
            }
        }
    }

    /**
     * The builder for a sprite component.
     */
    export class SpriteComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "sprite";
        }

        public buildFromJson( json: any ): IComponent {
            let data = new SpriteComponentData();
            data.setFromJson( json );
            return new SpriteComponent( data );
        }
    }

    /**
     * A component which renders a two-dimensional image on the screen.
     */
    export class SpriteComponent extends BaseComponent {

        private _sprite: Sprite;
        private _width: number;
        private _height: number;

        /**
         * Creates a new SpriteComponent.
         * @param data The data to create from.
         */
        public constructor( data: SpriteComponentData ) {
            super( data );

            this._width = data.width;
            this._height = data.height;
            this._sprite = new Sprite( name, data.materialName, this._width, this._height );
            if ( !data.origin.equals( Vector3.zero ) ) {
                this._sprite.origin.copyFrom( data.origin );
            }
        }

        /** Loads this component. */
        public load(): void {
            this._sprite.load();
        }

        /**
         * Renders this component.
         */
        public render( renderView: RenderView ): void {
            this._sprite.draw( this.owner.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix );

            super.render( renderView );
        }
    }

    ComponentManager.registerBuilder( new SpriteComponentBuilder() );
}