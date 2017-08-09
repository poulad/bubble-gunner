function resizeCanvas(canvas: HTMLCanvasElement, stage: createjs.Stage) {
    const max = 1200;

    if (window.innerHeight <= window.innerWidth) {
        canvas.height = canvas.width = window.innerHeight;
    } else {
        canvas.height = canvas.width = window.innerWidth;
    }

    if (canvas.width > max)
        canvas.height = canvas.width = max;

    let scaleFactor = canvas.width / BubbleGunner.NormalWidth;
    stage.scaleX = stage.scaleY = scaleFactor;

    const marginTop = (window.innerHeight - canvas.height) / 2;
    canvas.style.marginTop = `${marginTop}px`;
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