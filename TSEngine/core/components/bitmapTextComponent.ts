namespace TSE {

    export class BitmapTextComponentData implements IComponentData {
        public name: string;
        public fontName: string;
        public origin: Vector3 = Vector3.zero;
        public text: string;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.fontName !== undefined) {
                this.fontName = String(json.fontName);
            }

            if (json.text !== undefined) {
                this.text = String(json.text);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }
        }
    }

    export class BitmapTextComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "bitmapText";
        }

        public buildFromJson(json: any): IComponent {
            let data = new BitmapTextComponentData();
            data.setFromJson(json);
            return new BitmapTextComponent(data);
        }
    }

    export class BitmapTextComponent extends BaseComponent {

        private _bitmapText: BitmapText;
        private _fontName: string;

        public constructor(data: BitmapTextComponentData) {
            super(data);
            this._fontName = data.fontName;
            this._bitmapText = new BitmapText(this.name, this._fontName);
            if (!data.origin.equals(Vector3.zero)) {
                this._bitmapText.origin.copyFrom(data.origin);
            }

            this._bitmapText.text = data.text;
        }

        public load(): void {
            this._bitmapText.load();
        }

        public update(time: number): void {
            this._bitmapText.update(time);
        }

        public render(shader: Shader): void {
            this._bitmapText.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }

    ComponentManager.registerBuilder(new BitmapTextComponentBuilder());
}