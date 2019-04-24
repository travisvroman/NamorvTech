/// <reference path="../Math/Vector2.ts" />

namespace NT {

    /** The message code for mouse down events. */
    export const MESSAGE_MOUSE_DOWN: string = "MOUSE_DOWN";

    /** The message code for mouse up events. */
    export const MESSAGE_MOUSE_UP: string = "MOUSE_UP";

    /** Defines key codes for keyboard keys. */
    export enum Keys {

        /** The left arrow key */
        LEFT = 37,

        /** The up arrow key */
        UP = 38,

        /** The right arrow key */
        RIGHT = 39,

        /** The down arrow key */
        DOWN = 40
    }

    /** Contains mouse state data to be used throughout the engine. */
    export class MouseContext {

        /** Indicates if the left mouse button is down. Default: false. */
        public leftDown: boolean;

        /** Indicates if the right mouse button is down. Default: false. */
        public rightDown: boolean;

        /** The mouse position. */
        public position: Vector2;

        public constructor( leftDown: boolean = false, rightDown: boolean = false, position: Vector2 ) {
            this.leftDown = leftDown;
            this.rightDown = rightDown;
            this.position = position;
        }
    }

    /** Manages all input from devices such as the mouse and keyboard. */
    export class InputManager {

        private static _keys: boolean[] = [];

        private static _previousMouseX: number;
        private static _previousMouseY: number;
        private static _mouseX: number;
        private static _mouseY: number;
        private static _leftDown: boolean = false;
        private static _rightDown: boolean = false;
        private static _resolutionScale: Vector2 = Vector2.one;

        /**
         * Initializes the input manager.
         * @param viewport The canvas element to attach input events to
         */
        public static Initialize( viewport: HTMLCanvasElement ): void {
            for ( let i = 0; i < 255; ++i ) {
                InputManager._keys[i] = false;
            }

            window.addEventListener( "keydown", InputManager.onKeyDown );
            window.addEventListener( "keyup", InputManager.onKeyUp );

            viewport.addEventListener( "mousemove", InputManager.onMouseMove );
            viewport.addEventListener( "mousedown", InputManager.onMouseDown );
            viewport.addEventListener( "mouseup", InputManager.onMouseUp );
        }

        /**
         * Indicates if the provided key is currently down.
         * @param key The key to check.
         */
        public static isKeyDown( key: Keys ): boolean {
            return InputManager._keys[key];
        }

        /** Gets the current mouse position. */
        public static getMousePosition(): Vector2 {
            return new Vector2( this._mouseX, this._mouseY );
        }

        /** Gets the current mouse position. */
        public static getPreviousMousePosition(): Vector2 {
            return new Vector2( this._previousMouseX, this._previousMouseY );
        }

        /**
         * Sets the resolution scale, which is a ratio of the window width and height
         * versus the viewport canvas width and height.
         * @param scale The scale to set.
         */
        public static setResolutionScale( scale: Vector2 ): void {
            InputManager._resolutionScale.copyFrom( scale );
        }

        private static onKeyDown( event: KeyboardEvent ): boolean {
            InputManager._keys[event.keyCode] = true;
            return true;
        }

        private static onKeyUp( event: KeyboardEvent ): boolean {
            InputManager._keys[event.keyCode] = false;
            return true;
        }

        private static onMouseMove( event: MouseEvent ): void {
            InputManager._previousMouseX = InputManager._mouseX;
            InputManager._previousMouseY = InputManager._mouseY;

            let rect = ( event.target as HTMLElement ).getBoundingClientRect();
            InputManager._mouseX = ( event.clientX - Math.round( rect.left ) ) * ( 1 / InputManager._resolutionScale.x );
            InputManager._mouseY = ( event.clientY - Math.round( rect.top ) ) * ( 1 / InputManager._resolutionScale.y );
        }

        private static onMouseDown( event: MouseEvent ): void {
            if ( event.button === 0 ) {
                this._leftDown = true;
            } else if ( event.button === 2 ) {
                this._rightDown = true;
            }

            Message.send( MESSAGE_MOUSE_DOWN, this, new MouseContext( InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition() ) );
        }

        private static onMouseUp( event: MouseEvent ): void {
            if ( event.button === 0 ) {
                this._leftDown = false;
            } else if ( event.button === 2 ) {
                this._rightDown = false;
            }

            Message.send( MESSAGE_MOUSE_UP, this, new MouseContext( InputManager._leftDown, InputManager._rightDown, InputManager.getMousePosition() ) );
        }
    }
}