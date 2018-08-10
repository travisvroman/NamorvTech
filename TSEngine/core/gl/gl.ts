namespace TSE {

    /**
     * The WebGL rendering context.
     * */
    export var gl: WebGLRenderingContext;

    /**
     * Responsible for setting up a WebGL rendering context.
     * */
    export class GLUtilities {

        /**
         * Initializes WebGL, potentially using the canvas with an assigned id matching the provided if it is defined.
         * @param elementId The id of the elment to search for.
         */
        public static initialize( elementId?: string ): HTMLCanvasElement {
            let canvas: HTMLCanvasElement;

            if ( elementId !== undefined ) {
                canvas = document.getElementById( elementId ) as HTMLCanvasElement;
                if ( canvas === undefined ) {
                    throw new Error( "Cannot find a canvas element named:" + elementId );
                }
            } else {
                canvas = document.createElement( "canvas" ) as HTMLCanvasElement;
                document.body.appendChild( canvas );
            }

            gl = canvas.getContext( "webgl" );
            if ( gl === undefined ) {
                throw new Error( "Unable to initialize WebGL!" );
            }

            return canvas;
        }
    }
}