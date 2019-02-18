namespace NT {


    export interface IMessageHandler {

        onMessage( message: Message ): void;
    }
}