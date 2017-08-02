function resizeCanvas(canvas: HTMLCanvasElement, stage: createjs.Stage) {
    const widthToHeightRatio = 4 / 3;
    const maxWidth = 1200;
    const maxHeight = 900;

    const normalWidth = 800;
    const normalHeight = 600;

    if (window.innerHeight <= window.innerWidth) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * widthToHeightRatio;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width / widthToHeightRatio;
    }

    if (canvas.width > maxWidth) canvas.width = maxWidth;
    if (canvas.height > maxHeight) canvas.height = maxHeight;

    let scaleFactor = canvas.width / normalWidth;

    stage.scaleX = stage.scaleY = scaleFactor;
}

function init() {
    BubbleGunner.canvas = <HTMLCanvasElement> document.getElementById(`canvas`);
    let stage = new createjs.Stage(BubbleGunner.canvas);

    window.addEventListener(`resize`, resizeCanvas.bind(this, BubbleGunner.canvas, stage), false);
    resizeCanvas(BubbleGunner.canvas, stage);

    let gameManager = new BubbleGunner.GameManager(stage);
    gameManager.startGame();
}

window.addEventListener(`load`, init);