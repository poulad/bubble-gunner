namespace BubbleGunner {
    export let canvas: HTMLCanvasElement;

    export function getCanvasDimensions(): [number, number] {
        return [canvas.width, canvas.height];
    }
}