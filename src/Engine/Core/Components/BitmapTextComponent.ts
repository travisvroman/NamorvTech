namespace NT {

    export class BitmapTextComponentData implements IComponentData {
        public name: string;
        public fontName: string;
        public origin: Vector3 = Vector3.zero;
        public text: string;

        public setFromJson( json: any ): void {
            if ( json.name !== undefined ) {
                this.name = String( json.name );
            }

            if ( json.fontName !== undefined ) {
                this.fontName = String( json.fontName );
            }

            if ( json.text !== undefined ) {
                this.text = String( json.text );
            }

            if ( json.origin !== undefined ) {
                this.origin.setFromJson( json.origin );
            }
        }
    }

    export class BitmapTextComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "bitmapText";
        }

        public buildFromJson( json: any ): IComponent {
            let data = new BitmapTextComponentData();
            data.setFromJson( json );
            return new BitmapTextComponent( data );
        }
    }

    /**
     * A component which renders bitmap text.
     */
    export class BitmapTextComponent extends BaseComponent implements IMessageHandler {

        private _bitmapText: BitmapText;
        private _fontName: string;

        /**
         * Creates a new BitmapTextComponent.
         * @param data The data to use for creation.
         */
        public constructor( data: BitmapTextComponentData ) {
            super( data );
            this._fontName = data.fontName;
            this._bitmapText = new BitmapText( this.name, this._fontName );
            if ( !data.origin.equals( Vector3.zero ) ) {
                this._bitmapText.origin.copyFrom( data.origin );
            }

            this._bitmapText.text = data.text;

            // Listen for text updates.
            Message.subscribe( this.name + ":SetText", this );
        }

        /** Loads this component. */
        public load(): void {
            this._bitmapText.load();
        }

        /**
         * Updates this component.
         * @param time The amount of time in milliseconds since the last update.
         */
        public update( time: number ): void {
            this._bitmapText.update( time );
        }

        /**
         * Renders this component.
         * @param shader The shader to use for rendering.
         */
        public render( renderView: RenderView ): void {
            this._bitmapText.draw( this.owner.worldMatrix, renderView.viewMatrix, renderView.projectionMatrix );
            super.render( renderView );
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public onMessage( message: Message ): void {
            if ( message.code === this.name + ":SetText" ) {
                this._bitmapText.text = String( message.context );
            }
        }
    }

    ComponentManager.registerBuilder( new BitmapTextComponentBuilder() );
}