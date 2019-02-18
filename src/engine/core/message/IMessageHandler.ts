namespace TSE {


    export interface IMessageHandler {

        onMessage( message: Message ): void;
    }
}