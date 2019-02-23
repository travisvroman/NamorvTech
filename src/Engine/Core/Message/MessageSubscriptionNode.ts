namespace NT {

    /**
     * Represents a subscription to a message and holds a handler pointer.
     */
    export class MessageSubscriptionNode {

        /**
         * The message being subscribed to.
         */
        public message: Message;

        /**
         * The message handler.
         */
        public handler: IMessageHandler;

        /**
         * Creates a new MessageSubscriptionNode.
         * @param message The message being subscribed to.
         * @param handler The message handler.
         */
        public constructor( message: Message, handler: IMessageHandler ) {
            this.message = message;
            this.handler = handler;
        }
    }
}