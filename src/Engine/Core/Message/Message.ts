namespace NT {

    /** Represents message priorities. */
    export enum MessagePriority {

        /** Normal message priority, meaning the message is sent as soon as the queue allows. */
        NORMAL,

        /** High message priority, meaning the message is sent immediately. */
        HIGH
    }

    /** Represents a message which can be sent and processed across the system. */
    export class Message {

        /** The code for this message, which is subscribed to and listened for. */
        public code: string;

        /** Free-form context data to be included with this message. */
        public context: any;

        /** The class instance which sent this message. */
        public sender: any;

        /** The priority of this message. */
        public priority: MessagePriority;

        /**
         * Creates a new message.
         * @param code The code for this message, which is subscribed to and listened for.
         * @param sender The class instance which sent this message.
         * @param context Free-form context data to be included with this message.
         * @param priority The priority of this message.
         */
        public constructor( code: string, sender: any, context?: any, priority: MessagePriority = MessagePriority.NORMAL ) {
            this.code = code;
            this.sender = sender;
            this.context = context;
            this.priority = priority;
        }

        /**
         * Sends a normal-priority message with the provided parameters.
         * @param code The code for this message, which is subscribed to and listened for.
         * @param sender The class instance which sent this message.
         * @param context Free-form context data to be included with this message.
         */
        public static send( code: string, sender: any, context?: any ): void {
            MessageBus.post( new Message( code, sender, context, MessagePriority.NORMAL ) );
        }

        /**
         * Sends a high-priority message with the provided parameters.
         * @param code The code for this message, which is subscribed to and listened for.
         * @param sender The class instance which sent this message.
         * @param context Free-form context data to be included with this message.
         */
        public static sendPriority( code: string, sender: any, context?: any ): void {
            MessageBus.post( new Message( code, sender, context, MessagePriority.HIGH ) );
        }

        /**
         * Subscribes the provided handler to listen for the message code provided.
         * @param code The code to listen for.
         * @param handler The message handler to be called when a message containing the provided code is sent.
         */
        public static subscribe( code: string, handler: IMessageHandler ): void {
            MessageBus.addSubscription( code, handler, undefined );
        }

        /**
         * Subscribes the provided callback to listen for the message code provided.
         * @param code The code to listen for.
         * @param callback The message callback to be invoked when a message containing the provided code is sent.
         */
        public static subscribeCallback( code: string, callback: MessageCallback ): void {
            MessageBus.addSubscription( code, undefined, callback );
        }

        /**
         * Unsubscribes the provided handler from listening for the message code provided.
         * @param code The code to no longer listen for.
         * @param handler The message handler to unsubscribe.
         */
        public static unsubscribe( code: string, handler: IMessageHandler ): void {
            MessageBus.removeSubscription( code, handler, undefined );
        }

        /**
         * Unsubscribes the provided callback from listening for the message code provided.
         * @param code The code to no longer listen for.
         * @param callback The message callback to unsubscribe.
         */
        public static unsubscribeCallback( code: string, callback: MessageCallback ): void {
            MessageBus.removeSubscription( code, undefined, callback );
        }
    }
}