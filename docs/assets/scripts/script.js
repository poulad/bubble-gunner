function resizeCanvas(canvas, stage) {
    var widthToHeightRatio = 4 / 3;
    var maxWidth = 1200;
    var maxHeight = 900;
    var normalWidth = 800;
    var normalHeight = 600;
    if (window.innerHeight <= window.innerWidth) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * widthToHeightRatio;
    }
    else {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width / widthToHeightRatio;
    }
    if (canvas.width > maxWidth)
        canvas.width = maxWidth;
    if (canvas.height > maxHeight)
        canvas.height = maxHeight;
    var scaleFactor = canvas.width / normalWidth;
    stage.scaleX = stage.scaleY = scaleFactor;
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