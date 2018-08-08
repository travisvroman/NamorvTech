
namespace TSE {


    export class Engine {

        private _count: number = 0;

        public constructor() {
        }

        public start(): void {



            this.loop();
        }

        private loop(): void {
            this._count++;

            document.title = this._count.toString();

            requestAnimationFrame( this.loop.bind( this ) );
        }
    }
}


window.onload = function () {
    let e = new TSE.Engine();
    e.start();
    document.body.innerHTML += "Foo";
}