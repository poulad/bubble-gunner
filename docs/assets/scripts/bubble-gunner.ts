namespace BubbleGunner {
    import DisplayObject = createjs.DisplayObject;

    export let canvas: HTMLCanvasElement;

    export function getCanvasDimensions(): [number, number] {
        return [canvas.width, canvas.height];
    }

    export function getWindowDimensions(): [number, number] {
        return [window.innerWidth, window.innerHeight];
    }

    export interface IResizable {
        scaleFactor: number;
        maxScale: number;
        minScale: number;
        originalWidth: number;
        originalHeight: number;
    }

    export function adjustSize<T extends IResizable>(shape: T): void {
        if (!(shape instanceof DisplayObject)) {
            throw new Error(`Type ${typeof shape} does not extend ${DisplayObject}`);
        }
        const displayObj: DisplayObject = shape as DisplayObject;

        const windowDimensions = getWindowDimensions();
        let newScale = shape.scaleFactor * windowDimensions[0] / shape.originalWidth;

        console.warn(`original width: ${shape.originalWidth}`);
        console.warn(`window: ${windowDimensions}`);
        console.warn(`scale factor1: ${newScale}`);


        if (newScale < shape.minScale)
            newScale = shape.minScale;
        else if (newScale > shape.maxScale)
            newScale = shape.maxScale;

        console.warn(`scale factor2: ${newScale}`);

        displayObj.scaleX = displayObj.scaleY = newScale;
    }
}