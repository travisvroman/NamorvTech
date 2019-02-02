
var engine: TSE.Engine;

// The main entry point to the application.
window.onload = function () {
    engine = new TSE.Engine(320, 480);
    engine.start("viewport");
}

window.onresize = function () {
    engine.resize();
}