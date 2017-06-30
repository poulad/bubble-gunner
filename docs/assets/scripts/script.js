var Script;
(function (Script) {
    var canvas;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function init() {
        canvas = document.getElementById("canvas");
        window.addEventListener("resize", resizeCanvas, false);
        resizeCanvas();
    }
    Script.init = init;
})(Script || (Script = {}));
window.addEventListener("load", Script.init);
//# sourceMappingURL=script.js.map