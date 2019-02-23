namespace NT {

    /**
     * Anb interface which provides a message handler for objects which are 
     * to subscribe to messages.
     */
    export interface IMessageHandler {

        /**
         * The message handler.
         * @param message The message to be handled.
         */
        onMessage( message: Message ): void;
    }
}