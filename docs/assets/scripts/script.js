function resizeCanvas(canvas, stage) {
    var max = 1200;
    if (window.innerHeight <= window.innerWidth) {
        canvas.height = canvas.width = window.innerHeight;
    }
    else {
        canvas.height = canvas.width = window.innerWidth;
    }
    if (canvas.width > max)
        canvas.height = canvas.width = max;
    var scaleFactor = canvas.width / BubbleGunner.NormalWidth;
    stage.scaleX = stage.scaleY = scaleFactor;
    var marginTop = (window.innerHeight - canvas.height) / 2;
    canvas.style.marginTop = marginTop + "px";
}
function init() {
    BubbleGunner.canvas = document.getElementById("canvas");
    var stage = new createjs.Stage(BubbleGunner.canvas);
    window.addEventListener("resize", resizeCanvas.bind(this, BubbleGunner.canvas, stage), false);
    resizeCanvas(BubbleGunner.canvas, stage);
    var gameManager = new BubbleGunner.GameManager(stage);
    gameManager.startGame();
}
window.addEventListener("load", init);
//# sourceMappingURL=script.js.map