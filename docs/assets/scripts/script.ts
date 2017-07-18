import Shape = createjs.Shape;
import DisplayObject = createjs.DisplayObject;
import Stage = createjs.Stage;
import Ticker = createjs.Ticker;
import Tween = createjs.Tween;

let canvas: HTMLCanvasElement;

function addToArray(array: Array<any>, item: any): number {
    let i = 0;
    for (; i < array.length; i++) {
        if (array[i] === null) {
            break;
        }
    }
    array[i] = item;
    return i;
}

class Point {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class Animal extends Shape {
    public startPoint: Point;
    public endPoint: Point;
    public speed: number;

    constructor(point: Point) {
        super();
        const r = 15;
        this.graphics
            .beginFill('lime')
            .drawCircle(0, 0, r);

        this.x = point.x;
        this.y = point.y;
        this.startPoint = point;
    }

    public moveTo(point: Point): Tween {
        this.endPoint = point;
        let t = Tween.get(this)
            .to({
                x: point.x,
                y: point.y,
            }, 7000)
            .call(() => {
                Tween.get(this)
                    .to({alpha: 0}, 300);
            });

        return t;
    }
}

class Bubble extends Shape {
    public startPoint: Point;
    public endPoint: Point;
    public speed: number;
    public containsAnimal: boolean = false;

    private _animal: Animal;
    private _pulseEventListener: EventListener = this.pulse.bind(this);
    private _pulseCount = 0;
    private static r = 15;

    constructor(targetPoint: Point) {
        super();
        this.graphics
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, Bubble.r);
        this.addEventListener(`tick`, this._pulseEventListener);

        let initPoint = new Point(canvas.width / 2, canvas.height - 20);
        this.x = initPoint.x;
        this.y = initPoint.y;
        this.startPoint = initPoint;
        this.endPoint = targetPoint;
    }

    public move(): Tween {
        this.updateEndPoint();
        let tween: Tween;
        tween = Tween.get(this)
            .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, 4000);
        return tween;
    }

    public setAnimal(animal: Animal): void {
        this._animal = animal;
        this.containsAnimal = this._animal != undefined;
    }

    public getAnimal(): Animal {
        return this._animal;
    }

    private pulse(): void {
        let alpha = Math.cos(this._pulseCount++ * 0.1) * 0.4 + 0.6;
        Tween.get(this)
            .to({
                alpha: alpha
            }, 100);
        this._pulseCount++;
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
    private _bubbles: Bubble[] = [];

    private _stageTickEventListener: EventListener = this.tick.bind(this);
    private _stageClickEventListener: EventListener = this.handleClick.bind(this);

    private _isReadyToHandleTick: boolean = true;

    constructor(private _stage: Stage) {

    }

    public start() {
        let intervalAnimal = setInterval(this.handleInterval.bind(this), 3000);

        this._stage.addEventListener(`stagemouseup`, this._stageClickEventListener, false);
        this._stage.addEventListener(`tick`, this._stageTickEventListener);
    }

    private handleInterval() {
        let animal = new Animal(new Point(this.getRandomX(), 0));
        let index = addToArray(this._animals, animal);
        this._stage.addChild(animal);
        console.debug(this._animals);

        animal.moveTo(new Point(this.getRandomX(), canvas.width))
            .call(this.removeShape.bind(this, animal, index));
    }

    private handleClick(evt: createjs.MouseEvent): void {
        let bubble = new Bubble(new Point(evt.stageX, evt.stageY));
        let index = addToArray(this._bubbles, bubble);
        this._stage.addChild(bubble);
        console.debug(this._bubbles);

        bubble.move()
            .call(this.removeShape.bind(this, bubble, index));
    }

    private removeShape(shape: Shape, index: number = undefined): void {
        this._stage.removeChild(shape);
        if (index === undefined)
            return;

        if (shape instanceof Bubble) {
            this._bubbles[index] = null;
        } else if (shape instanceof Animal) {
            this._animals[index] = null;
        }
    }

    private tick() {
        if (!this._isReadyToHandleTick)
            return;

        this._isReadyToHandleTick = false;
        for (let i = 0; i < this._bubbles.length; i++) {
            if (this._bubbles[i] == undefined) continue;

            let b = this._bubbles[i];
            for (let j = 0; j < this._animals.length; j++) {
                if (this._animals[j] == undefined) continue;

                let a = this._animals[j];
                try {
                    let distance = Math.sqrt(
                        Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2)
                    );

                    if (distance <= 30 && !b.containsAnimal) {
                        this.wrapAnimalInBubble(b, a);
                        // this._stage.removeChild(a, b);
                        // b = a = null;
                    }
                }
                catch (exc) {
                    console.info(exc.message);
                }
            }
        }
        this._isReadyToHandleTick = true;
        return;
    }

    private wrapAnimalInBubble(bubble: Bubble, animal: Animal): void {
        bubble.setAnimal(animal);
        bubble.graphics
            .clear()
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, 15 + 5);
        bubble.x = animal.x;
        bubble.y = animal.y;

        Tween.removeTweens(bubble);
        Tween.removeTweens(animal);
        const time = 3500;
        const y = -25;

        Tween.get(animal)
            .to({
                y: y
            }, time);
        Tween.get(bubble)
            .to({
                y: y
            }, time)
            .call(() => {
                this._stage.removeChild(bubble, animal);

                this._isReadyToHandleTick = false;
                let i: number;

                i = this._animals.indexOf(animal);
                if (i > -1) this._animals[i] = null;

                i = this._bubbles.indexOf(bubble);
                if (i > -1) this._bubbles[i] = null;

                this._isReadyToHandleTick = true;
            });
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

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init() {
    canvas = <HTMLCanvasElement> document.getElementById(`canvas`);
    window.addEventListener(`resize`, resizeCanvas, false);
    resizeCanvas();

    let stage = new Stage(canvas);
    let manager = new GameManager(stage);

    Ticker.addEventListener(`tick`, stage);
    createjs.Touch.enable(stage);
    manager.start();
}

window.addEventListener(`load`, init);
