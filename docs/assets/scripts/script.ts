import Shape = createjs.Shape;
import DisplayObject = createjs.DisplayObject;
import Stage = createjs.Stage;
import Ticker = createjs.Ticker;
import Tween = createjs.Tween;

class Point {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class Animal {
    private _shape: Shape;
    public startPoint: Point;
    public endPoint: Point;
    public speed: number;

    constructor(point: Point) {
        const r = 15;
        this._shape = new Shape();
        this._shape.graphics
            .beginFill('lime')
            .drawCircle(0, 0, r);
        console.info(this._shape.regY);
        this._shape.x = point.x;
        this._shape.y = point.y;
        this.startPoint = point;
        this._shape.regY = r;
    }

    public moveTo(point: Point): void {
        this.endPoint = point;
        Tween.get(this._shape)
            .to({
                x: point.x,
                y: point.y,
            }, 7000);
    }

    public getShape(): Shape {
        return this._shape;
    }
}

class Bubble {
    private _shape: Shape;
    public startPoint: Point;
    public endPoint: Point;
    public speed: number;

    constructor(targetPoint: Point) {
        const r = 15;
        this._shape = new Shape();
        this._shape.graphics
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, r);
        this._shape.regY = r;

        let initPoint = new Point(canvas.width / 2, canvas.height - 20);
        this._shape.x = initPoint.x;
        this._shape.y = initPoint.y;
        this.startPoint = initPoint;
        this.endPoint = targetPoint;
    }

    public move(): void {
        this.updateEndPoint();
        Tween.get(this._shape)
            .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, 4000);
    }

    public getShape(): Shape {
        return this._shape;
    }

    private updateEndPoint(): void {
        /*
        line equation:
        y = mx + b
        m = (y2 - y1) / (x2 - x1)
        */

        let m = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
        let b = this.startPoint.y - m * this.startPoint.x;

        this.endPoint.y = 0;
        this.endPoint.x = -(b / m);
    }
}

class GameManager {
    private _animals: Animal[] = [];

    constructor(private _stage: Stage) {

    }

    public start() {
        let intervalAnimal = setInterval(() => {
            let a = new Animal(new Point(this.getRandomX(), 0));
            let s = a.getShape();

            this._stage.addChild(s);
            a.moveTo(new Point(this.getRandomX(), canvas.width));
        }, 3000);
    }

    private getRandomX(): number {
        let x: number;
        x = (Math.random() * 324627938) % canvas.width;
        return x;
    }

    private getRandomY(): number {
        let y: number;
        y = (Math.random() * 876372147) % canvas.height;
        return y;
    }
}

let canvas: HTMLCanvasElement;
let stage: Stage;

function handleClick(evt: MouseEvent): void {
    let bubble = new Bubble(new Point(evt.x, evt.y));
    stage.addChild(bubble.getShape());
    bubble.move();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    canvas = <HTMLCanvasElement> document.getElementById(`canvas`);
    window.addEventListener(`resize`, resizeCanvas, false);
    resizeCanvas();

    stage = new Stage(canvas);
    let manager = new GameManager(stage);

    Ticker.addEventListener(`tick`, stage);
    createjs.Touch.enable(stage);
    manager.start();

    canvas.addEventListener(`click`, handleClick, false);
}

window.addEventListener(`load`, init);
