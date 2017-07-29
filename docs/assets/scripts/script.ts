import Shape = createjs.Shape;
import Stage = createjs.Stage;
import Ticker = createjs.Ticker;
import Tween = createjs.Tween;
import DisplayObject = createjs.DisplayObject;
import Container = createjs.Container;

let canvas: HTMLCanvasElement;

namespace BubbleGunner {
    import Text = createjs.Text;
    import Bitmap = createjs.Bitmap;
    import Ease = createjs.Ease;
    import MouseEvent = createjs.MouseEvent;

    export function isOfType<T>(type: T) {
        return (o: any) => o instanceof (<any>type);
    }

    export function toType<T>() {
        return (o: any) => o as T;
    }

    export function isCollidingWith(o: DisplayObject) {
        return (other: DisplayObject) => findDistance(new Point(o.x, o.y), new Point(other.x, other.y)) < 30;
    }

    export function hasCollisions(tuple: [Bubble, Animal[]]): boolean {
        return tuple[1].length > 0;
    }

    export function findDistance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));
    }

    export function getTweenDurationMSecs(p1: Point, p2: Point, speed: number = 200): number {
        return Math.floor(findDistance(p1, p2) * 1000 / speed);
    }

    export class Point {
        public x: number;
        public y: number;

        public constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }

        public toString(): string {
            return `(${this.x} , ${this.y})`;
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
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint))
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
        public static Speed: number = 180;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;
        private static width = 12;
        private static height = 15;

        constructor(startX: number) {
            super();
            this.graphics
                .beginFill('red')
                .drawRect(0, 0, Lava.width, Lava.height);

            this.startPoint = new Point(startX, 0);
            this.x = this.startPoint.x;
            this.y = this.startPoint.y;
        }

        public moveTo(point: Point): Tween {
            this.endPoint = point;

            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Lava.Speed))
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

        constructor(from: Point, to: Point) {
            super();
            this.graphics
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .drawCircle(0, 0, Bubble.r);
            this.on(`tick`, this.pulse, this);

            this.startPoint = from;
            this.x = this.startPoint.x;
            this.y = this.startPoint.y;
            this.endPoint = to;
        }

        public move(): Tween {
            this.updateEndPoint();
            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint))
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

    class Dragon extends Container {
        private _body: Bitmap;
        private _hand: Bitmap;
        private _gun: Bitmap;
        private _gunContainer: Container;

        constructor() {
            super();
            this._body = new Bitmap(`assets/images/dragon.png`);
            this._hand = new Bitmap(`assets/images/hand.png`);

            this._hand.x = 0;
            this._hand.y = 170;

            this._gun = new Bitmap(`assets/images/gun.png`);
            this._gun.regX = 379;
            this._gun.regY = 101.5;
            this._gun.x = this._gun.regX - 165;
            this._gun.y = this._gun.regY + 100;

            this._gunContainer = new Container();
            this._gunContainer.addChild(this._gun, this._hand);

            this.addChild(this._body, this._gun, this._hand);
        }

        public shootBubbleTo(point: Point): Bubble {
            this.aimGunToPoint(point);

            let bubble = new Bubble(this.getGunMuzzleStagePoint(), point);
            // console.debug(`Shooting bubble from: ${this.getGunMuzzleStagePoint()}`);
            bubble.scaleX = bubble.scaleY = .1;
            Tween.get(bubble)
                .to({
                    scaleX: 1,
                    scaleY: 1,
                }, 150, Ease.bounceOut);

            return bubble;
        }

        public aimGun(evt: MouseEvent) {
            this.aimGunToPoint(new Point(evt.stageX, evt.stageY));
        }

        private aimGunToPoint(targetPoint: Point): void {
            let gunPoint = this.getGunRegStagePoint();

            if (gunPoint.x < targetPoint.x) {
                this.scaleX = -Math.abs(this.scaleX);
            } else {
                this.scaleX = Math.abs(this.scaleX);
            }

            gunPoint = this.getGunRegStagePoint();

            let yz = gunPoint.y - targetPoint.y;
            let xz = gunPoint.x - targetPoint.x;
            this._gun.rotation = Math.abs(Math.atan(yz / xz) / Math.PI * 180);
            // console.debug(`aiming at angle: ${angle}`);
        }

        private getGunMuzzleStagePoint(): Point {
            let p: Point = new Point();

            let rotationRadians = Math.PI + this._gun.rotation * Math.PI / 180;
            if (this.scaleX < 0) {
                rotationRadians = 2 * Math.PI - rotationRadians;
            }
            let radius = this._gun.image.width * this.scaleX;
            let center = this.getGunRegStagePoint();
            p.x = center.x + radius * Math.cos(rotationRadians);
            p.y = center.y + radius * Math.sin(rotationRadians);

            // console.debug(`Gun muzzle at: ${p}`);
            return p;
        }

        private getGunRegStagePoint(): Point {
            return new Point(
                this.x + (this._gun.x) * this.scaleX,
                this.y + (this._gun.y) * this.scaleY
            );
        }
    }

    class ScoresBar extends Container {
        private _bar: Shape;
        private _scoreText: Text;

        constructor(percent: number = 0) {
            super();
            const width = 300;
            const height = 50;

            this._bar = new Shape();
            this._bar.graphics
                .beginFill(`yellow`)
                .drawRect(0, 0, width, height);
            this._bar.scaleX = percent / 100;
            this._bar.x = 0;
            this._bar.y = 0;

            this._scoreText = new Text('10', undefined, 'white');
            this._scoreText.x = width / 2;
            this._scoreText.y = height + 10;

            this.addChild(this._bar, this._scoreText);
        }
    }

    export class GameManager {
        private _dragon: Dragon;
        private _animals: Animal[] = [];
        private _bubbles: Bubble[] = [];
        private _lavas: Lava[] = [];
        private _isShapesLockFree: boolean = true;

        constructor(private _stage: Stage) {

        }

        public start() {
            setInterval(this.handleAnimalRainInterval.bind(this), 3000);
            setInterval(this.handleLavaRainInterval.bind(this), 4000);

            // let scores = new ScoresBar(); // ToDo
            // scores.x = 100;
            // scores.y = 50;
            // this._stage.addChild(scores);

            this._dragon = new Dragon();
            this._dragon.scaleX = this._dragon.scaleY = .25;
            this._dragon.x = canvas.width / 2 - 25;
            this._dragon.y = canvas.height - 100;

            this._stage.addChild(this._dragon);

            this._stage.on(`stagemousemove`, this._dragon.aimGun, this._dragon);
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
            let lava = new Lava(this.getRandomX());
            this.lockShapes(() => this._lavas.push(lava));
            this._stage.addChild(lava);
            console.debug(this._lavas);

            lava.on(Lava.EventFell, () => this.removeShape(lava), this);
            lava.moveTo(new Point(this.getRandomX(), canvas.width));
        }

        private handleClick(evt: createjs.MouseEvent): void {
            let bubble = this._dragon.shootBubbleTo(new Point(evt.stageX, evt.stageY));
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
                    .filter(hasCollisions)
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
            return this._animals.filter(isCollidingWith(bubble));
        }

        private isCollidingWithAnyLava(lavas: Lava[]) {
            return (b: Bubble) => (lavas
                .filter(l => Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30)
                .length > 0);
        }
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
    let manager = new BubbleGunner.GameManager(stage);

    Ticker.addEventListener(`tick`, stage);
    createjs.Touch.enable(stage);
    manager.start();
}

window.addEventListener(`load`, init);
