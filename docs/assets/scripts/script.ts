namespace Script {
    let canvas: HTMLCanvasElement;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    export function init() {
        canvas = <HTMLCanvasElement> document.getElementById(`canvas`);
        window.addEventListener(`resize`, resizeCanvas, false);
        resizeCanvas();
    }
}

window.addEventListener(`load`, Script.init);
