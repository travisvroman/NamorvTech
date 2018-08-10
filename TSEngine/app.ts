
var engine: TSE.Engine;

// The main entry point to the application.
window.onload = function () {
    engine = new TSE.Engine();
    engine.start();
}

window.onresize = function () {
    engine.resize();
}