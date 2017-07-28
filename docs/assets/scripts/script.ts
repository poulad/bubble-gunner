import Shape = createjs.Shape;
import Stage = createjs.Stage;
import Ticker = createjs.Ticker;
import Tween = createjs.Tween;
import DisplayObject = createjs.DisplayObject;

let canvas: HTMLCanvasElement;

namespace BubbleGunner.Funcs {
    export function isOfType<T>(type: T) {
        return (o: any) => o instanceof (<any>type);
    }

    export function toType<T>() {
        return (o: any) => o as T;
    }

    export function isCollidingWith(o: DisplayObject) {
        return (other: DisplayObject) => Math.sqrt(
            Math.pow(o.y - other.y, 2) + Math.pow(o.x - other.x, 2)
        ) < 30;
    }

    export function hasCollisions(tuple: [Bubble, Animal[]]): boolean {
        return tuple[1].length > 0;
    }
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
    public static EventFell: string = `fell`;

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
        return Tween.get(this)
            .to({
                x: point.x,
                y: point.y,
            }, 7000)
            .call(this.fallCallback.bind(this));
    }

    public continueFall(): Tween {
        Tween.removeTweens(this);
        let newEndPoint = new Point(this.endPoint.x, canvas.height);
        return this.moveTo(newEndPoint);
    }

    private fallCallback(): Tween {
        return Tween.get(this)
            .to({alpha: .3}, 300)
            .call(this.dispatchEvent.bind(this, Animal.EventFell));
    }
}

class Lava extends Shape {
    public static EventFell: string = `fell`;

    public startPoint: Point;
    public endPoint: Point;
    public speed: number;
    private static width = 12;
    private static height = 15;

    constructor(point: Point) {
        super();
        this.graphics
            .beginFill('red')
            .drawRect(0, 0, Lava.width, Lava.height);

        this.x = point.x;
        this.y = point.y;
        this.startPoint = point;
    }

    public moveTo(point: Point): Tween {
        this.endPoint = point;
        return Tween.get(this)
            .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, 5500)
            .call(() => this.dispatchEvent(new Event(Lava.EventFell)));
    }
}

class Bubble extends Shape {
    public static EventPopped: string = `popped`;
    public static EventAscended: string = `ascended`;
    public static EventRescuedAnimal: string = `rescued`;

    public startPoint: Point;
    public endPoint: Point;
    public speed: number;
    public containsAnimal: boolean = false;

    private _animal: Animal;
    private _pulseCount = 0;
    private static r = 15;

    constructor(targetPoint: Point) {
        super();
        this.graphics
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, Bubble.r);
        this.on(`tick`, this.pulse, this);

        let initPoint = new Point(canvas.width / 2, canvas.height - 20);
        this.x = initPoint.x;
        this.y = initPoint.y;
        this.startPoint = initPoint;
        this.endPoint = targetPoint;
    }

    public move(): Tween {
        this.updateEndPoint();
        return Tween.get(this)
            .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, 4000)
            .call(this.dispatchEvent.bind(this, new Event(Bubble.EventAscended)));
    }

    public takeAnimal(animal: Animal): Tween {
        this._animal = animal;
        this.containsAnimal = true;

        this.graphics
            .clear()
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, 15 + 5);
        this.x = this._animal.x;
        this.y = this._animal.y;

        Tween.removeTweens(this._animal);
        Tween.removeTweens(this);

        const targetY = -7;
        const duration = 3500;

        let tween = Tween.get(this)
            .to({y: targetY}, duration)
            .call(this.dispatchEvent.bind(this, new Event(Bubble.EventRescuedAnimal)));
        tween.on(`change`, () => this._animal.y = this.y, this);

        return tween;
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

    public pop(): Tween {
        Tween.removeTweens(this);

        if (this.containsAnimal) {
            this._animal.continueFall();
        }

        return Tween.get(this)
            .to({
                alpha: 0
            }).call(this.dispatchEvent.bind(this, new Event(Bubble.EventPopped)));
    }
}

class GameManager {
    private _animals: Animal[] = [];
    private _bubbles: Bubble[] = [];
    private _lavas: Lava[] = [];
    private _isShapesLockFree: boolean = true;

    constructor(private _stage: Stage) {

    }

    public start() {
        setInterval(this.handleAnimalRainInterval.bind(this), 3000);
        setInterval(this.handleLavaRainInterval.bind(this), 4000);

        this._stage.on(`stagemouseup`, this.handleClick, this);
        this._stage.on(`tick`, this.tick, this);
    }

    private handleAnimalRainInterval() {
        let animal = new Animal(new Point(this.getRandomX(), 0));
        this.lockShapes(() => {
            this._animals.push(animal);
        });
        this._stage.addChild(animal);
        console.debug(this._animals);

        animal.on(Animal.EventFell, () => this.removeShape(animal), this);
        animal.moveTo(new Point(this.getRandomX(), canvas.width));
    }

    private handleLavaRainInterval() {
        let lava = new Lava(new Point(this.getRandomX(), 0));
        this.lockShapes(() => this._lavas.push(lava));
        this._stage.addChild(lava);
        console.debug(this._lavas);

        lava.on(Lava.EventFell, () => this.removeShape(lava), this);
        lava.moveTo(new Point(this.getRandomX(), canvas.width));
    }

    private handleClick(evt: createjs.MouseEvent): void {
        let bubble = new Bubble(new Point(evt.stageX, evt.stageY));
        this.lockShapes(() => {
            this._bubbles.push(bubble);
        });
        this._stage.addChild(bubble);
        console.debug(this._bubbles);

        bubble.on(Bubble.EventPopped, () => this.removeShape(bubble), this);
        bubble.on(Bubble.EventAscended, () => this.removeShape(bubble), this);
        bubble.on(Bubble.EventRescuedAnimal, () => this.removeShape(bubble.getAnimal(), bubble), this);
        bubble.move();
    }

    private removeShape(...shapes: Shape[]): void {
        this.lockShapes(() => {
            for (let shape of shapes) {
                this._stage.removeChild(shape);

                if (shape instanceof Bubble) {
                    this._bubbles = this._bubbles
                        .filter(b => b !== shape && b != undefined);

                    console.debug(this._bubbles);
                } else if (shape instanceof Animal) {
                    this._animals = this._animals
                        .filter(a => a !== shape && a != undefined);

                    console.debug(this._animals);
                } else if (shape instanceof Lava) {
                    this._lavas = this._lavas
                        .filter(l => l !== shape && l != undefined);

                    console.debug(this._lavas);
                } else {
                    console.warn(`Unkown type to remove: ${shape}`);
                }
            }
        });
    }

    private tick(): void {
        if (!this._isShapesLockFree)
            return;

        this.lockShapes(() => {
            this._bubbles
                .filter(this.isCollidingWithAnyLava(this._lavas))
                .forEach((b: Bubble) => b.pop());

            this._bubbles
                .filter(b => !b.containsAnimal)
                .map(b => [b, this.findAnimalsCollidingWithBubble(b)])
                .filter(BubbleGunner.Funcs.hasCollisions)
                .map(tuple => <[Bubble, Animal]>[tuple[0], tuple[1][0]])
                .forEach((tuple: [Bubble, Animal]) => tuple[0].takeAnimal(tuple[1]));
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

    private lockShapes(f: Function) {
        this._isShapesLockFree = false;
        f();
        this._isShapesLockFree = true;
    }

    private findAnimalsCollidingWithBubble(bubble: Bubble): Animal[] {
        return this._animals.filter(BubbleGunner.Funcs.isCollidingWith(bubble));
    }

    private isCollidingWithAnyLava(lavas: Lava[]) {
        return (b: Bubble) => (lavas
            .filter(l => Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30)
            .length > 0);
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
