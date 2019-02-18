namespace NT {

    export class VisibilityOnMessageBehaviorData implements IBehaviorData {
        public name: string;
        public messageCode: string;
        public visible: boolean;

        public setFromJson(json: any): void {
            if (json.messageCode === undefined) {
                throw new Error("VisibilityOnMessageBehaviorData requires 'messageCode' to be defined.");
            } else {
                this.messageCode = String(json.messageCode);
            }

            if (json.visible === undefined) {
                throw new Error("VisibilityOnMessageBehaviorData requires 'visible' to be defined.");
            } else {
                this.visible = Boolean(json.visible);
            }
        }
    }

    export class VisibilityOnMessageBehaviorBuilder implements IBehaviorBuilder {

        public get type(): string {
            return "visibilityOnMessage";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new VisibilityOnMessageBehaviorData();
            data.setFromJson(json);
            return new VisibilityOnMessageBehavior(data);
        }
    }

    /**
     * A behavior which enables or disables visibility when the configured message is recieved.
     */
    export class VisibilityOnMessageBehavior extends BaseBehavior implements IMessageHandler {

        private _messageCode: string;
        private _visible: boolean;

        /**
         * Creates a new VisibilityOnMessageBehavior.
         * @param data The data for this behavior.
         */
        public constructor(data: VisibilityOnMessageBehaviorData) {
            super(data);

            this._messageCode = data.messageCode;
            this._visible = data.visible;

            Message.subscribe(this._messageCode, this);
        }

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        public onMessage(message: Message): void {
            if (message.code === this._messageCode) {
                this._owner.isVisible = this._visible;
            }
        }
    }

    BehaviorManager.registerBuilder(new VisibilityOnMessageBehaviorBuilder());
} 