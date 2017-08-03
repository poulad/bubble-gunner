namespace BubbleGunner.Game {
    import Shape = createjs.Shape;
    import Tween = createjs.Tween;
    import Container = createjs.Container;
    import Text = createjs.Text;
    import Bitmap = createjs.Bitmap;
    import Ease = createjs.Ease;
    import MouseEvent = createjs.MouseEvent;
    import EventDispatcher = createjs.EventDispatcher;

    export function isOfType<T>(type: T) {
        return (o: any) => o instanceof (<any>type);
    }

    export function toType<T>() {
        return (o: any) => o as T;
    }

    export function hasCollisions(tuple: [Bubble, Animal[]]): boolean {
        return tuple[1].length > 0;
    }

    export function findDistance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));
    }

    export function getTweenDurationMSecs(p1: Point, p2: Point, speed: number = 180): number {
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
        public static Radius: number = 18;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;

        constructor(point: Point) {
            super();

            this.graphics
                .beginFill('lime')
                .drawCircle(0, 0, Animal.Radius);

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
            let newEndPoint = new Point(this.endPoint.x, getCanvasDimensions()[1]);
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
        private static Speed: number = 180;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;
        private static Width = 20;
        private static Height = 18;

        constructor(startX: number) {
            super();
            this.graphics
                .beginFill('red')
                .drawRect(0, 0, Lava.Width, Lava.Height);

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
        public static Radius: number = 22;

        private static Speed: number = 450;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;
        public containsAnimal: boolean = false;

        private _animal: Animal;
        private _pulseCount = 0;

        constructor(from: Point, to: Point) {
            super();
            this.graphics
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .drawCircle(0, 0, Bubble.Radius);
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
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Bubble.Speed))
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventAscended)));
        }

        public takeAnimal(animal: Animal): Tween {
            this._animal = animal;
            this.containsAnimal = true;

            this.graphics
                .clear()
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .drawCircle(0, 0, Bubble.Radius);
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

    class DragonHand extends Bitmap {
        constructor() {
            super(`assets/images/dragon-hand.png`);

            this.regX = 426;
            this.regY = 110;
        }
    }

    class Dragon extends Container {
        public originalWidth = 140;
        public originalHeight = 408;

        private _body: Bitmap;
        private _hand: DragonHand;

        constructor() {
            super();
            this._body = new Bitmap(loader.getResult(`dragon`));

            this._hand = new Bitmap(loader.getResult(`dragon-hand`));
            this._hand.regX = 426;
            this._hand.regY = 110;
            this._hand.x = 250;
            this._hand.y = 180;

            this.addChild(this._body, this._hand);
        }

        public shootBubbleTo(point: Point): Bubble {
            this.aimGunToPoint(point);

            let bubble = new Bubble(this.getGunMuzzleStagePoint(), point);
            console.debug(`Shooting bubble from: ${this.getGunMuzzleStagePoint()}`);

            const targetScale = bubble.scaleX;
            bubble.scaleX = bubble.scaleY = .1;
            Tween.get(bubble)
                .to({
                    scaleX: targetScale,
                    scaleY: targetScale,
                }, 150, Ease.bounceOut);

            return bubble;
        }

        public aimGun(evt: MouseEvent) {
            this.aimGunToPoint(new Point(evt.stageX, evt.stageY));
        }

        private aimGunToPoint(targetPoint: Point): void {
            let handRegStagePoint = this.getHandRegStagePoint();
            if (handRegStagePoint.x < targetPoint.x) {
                this.scaleX = -Math.abs(this.scaleX);
            } else {
                this.scaleX = Math.abs(this.scaleX);
            }
            handRegStagePoint = this.getHandRegStagePoint();

            let yz = handRegStagePoint.y - targetPoint.y;
            let xz = handRegStagePoint.x - targetPoint.x;

            let angle: number;
            angle = Math.abs(Math.atan(yz / xz) / Math.PI * 180);
            this._hand.rotation = angle;
            // console.debug(`aiming at angle: ${angle}`);
        }

        private getHandRegStagePoint(): Point {
            return new Point(
                this.x + this._hand.x * this.scaleX,
                this.y + this._hand.y * this.scaleY
            );
        }

        private getGunMuzzleStagePoint(): Point {
            let p: Point = new Point();

            let rotationRadians = Math.PI + this._hand.rotation * Math.PI / 180;
            if (this.scaleX < 0) {
                rotationRadians = 2 * Math.PI - rotationRadians;
            }
            let radius = 426 * this.scaleX;
            let center = this.getHandRegStagePoint();
            p.x = center.x + radius * Math.cos(rotationRadians);
            p.y = center.y + radius * Math.sin(rotationRadians);

            // console.debug(`Gun muzzle at: ${p}`);
            return p;
        }
    }

    class LevelManager extends EventDispatcher {
        public static EventLevelChanged: string = `levelChanged`;
        public currentLevel: number = 1;

        private static Level1MaxScore = 4;

        public getLevelMaxScore(level?: number): number {
            if (level == undefined) {
                level = this.currentLevel;
            }
            return LevelManager.Level1MaxScore * level;
        }

        public setScore(score: number): void {
            if (this.currentLevel < 3 && score > this.getLevelMaxScore()) {
                this.currentLevel++;
                this.dispatchEvent(new Event(LevelManager.EventLevelChanged));
            }
            // console.debug(`score => ${score}`);
            // console.debug(`level => ${this.currentLevel}`);
        }
    }

    class ScoresBar extends Container {
        private _bar: Shape;
        private _scoreText: Text;
        private _score: number;

        constructor(private _levelManager: LevelManager, initialScore: number = 0) {
            super();
            this._score = initialScore;

            const width = 200;
            const height = 30;

            this._bar = new Shape();
            this._bar.graphics
                .beginFill(`yellow`)
                .drawRect(0, 0, 2, 5);
            this._bar.scaleX = 0;
            this._bar.x = 0;
            this._bar.y = 0;

            this._scoreText = new Text(this._score.toString(), undefined, 'white');
            this._scoreText.x = width / 2;
            this._scoreText.y = height + 10;

            this.addChild(this._bar, this._scoreText);
        }

        public increaseScore(): void {
            this.setScore(this._score + 1);
        }

        private setScore(score: number): void {
            this._score = score;
            this._levelManager.setScore(this._score);
            let levelCompletedPercent = this._score / this._levelManager.getLevelMaxScore() * 100;
            levelCompletedPercent = levelCompletedPercent >= 100 ? 100 : levelCompletedPercent;
            Tween.get(this._bar)
                .to({
                    scaleX: levelCompletedPercent
                }, 300);
            this._scoreText.text = this._score.toString();
        }
    }

    export class GameScene extends Scene {
        private _levelManager: LevelManager = new LevelManager();
        private _scoresBar: ScoresBar;
        private _dragon: Dragon;
        private _animals: Animal[] = [];
        private _bubbles: Bubble[] = [];
        private _lavas: Lava[] = [];
        private _isShapesLockFree: boolean = true;
        private _animalRainInterval: number;
        private _lavaRainInterval: number;

        constructor() {
            super();

            let bgColor = new Shape();
            bgColor.graphics
                .beginFill(`#222`)
                .drawRect(0, 0, NormalWidth, NormalHeight);
            bgColor.x = bgColor.y = 0;
            this.addChild(bgColor);

            let volcano = new Bitmap(loader.getResult(`volcano`));
            this.addChild(volcano);

            this._scoresBar = new ScoresBar(this._levelManager);
            this._scoresBar.x = 10;
            this._scoresBar.y = 10;

            this._dragon = new Dragon();
            this._dragon.scaleX = this._dragon.scaleY = .25;
            this._dragon.x = 400 - this._dragon.originalWidth / 2;
            this._dragon.y = 600 - this._dragon.originalHeight * this._dragon.scaleY;

            let s = new Shape();
            s.graphics
                .beginFill(`#eee`)
                .drawRect(0, 0, 50, 50);
            s.x = 20;
            s.y = 600 - 70;
            s.on(`click`, this.changeGameScene, this);
            let pause = new Text();
            pause.text = `Puase`;
            pause.x = 30;
            pause.y = 600 - 70 + 15;
            s.cursor = `pointer`;
            this.addChild(s, pause);

            this.addChild(this._scoresBar, this._dragon);
            this.on(`tick`, this.tick, this);
        }

        public start(...args: any[]): void {
            this._animalRainInterval = setInterval(this.handleAnimalRainInterval.bind(this), 3000);
            this._lavaRainInterval = setInterval(this.handleLavaRainInterval.bind(this), 4000);

            this.stage.on(`stagemousemove`, this._dragon.aimGun, this._dragon);
            this.stage.on(`stagemouseup`, this.handleClick, this);
        }

        public changeGameScene(): void {
            this.removeAllChildren();
            this._bubbles.length = this._animals.length = this._lavas.length = 0;
            clearInterval(this._animalRainInterval);
            clearInterval(this._lavaRainInterval);
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Menu));
        }

        private handleAnimalRainInterval() {
            let animal = new Animal(new Point(GameScene.getRandomX(), 0));
            this.lockShapes(() => {
                this._animals.push(animal);
            });
            this.addChild(animal);
            console.debug(this._animals);

            animal.on(Animal.EventFell, () => this.removeShape(animal), this);
            animal.moveTo(new Point(GameScene.getRandomX(), getCanvasDimensions()[1]));
        }

        private handleLavaRainInterval() {
            let throwLava: Function = () => {
                let lava = new Lava(GameScene.getRandomX());
                this.lockShapes(() => this._lavas.push(lava));
                this.addChild(lava);
                console.debug(this._lavas);

                lava.on(Lava.EventFell, () => this.removeShape(lava), this);
                lava.moveTo(new Point(GameScene.getRandomX(), getCanvasDimensions()[1]));
            };
            // console.debug(`level: ${this._levelManager.currentLevel}`);
            switch (this._levelManager.currentLevel) {
                case 1:
                    // no lava
                    break;
                case 2:
                    throwLava();
                    break;
                case 3:
                    throwLava();
                    setTimeout(throwLava, 900);
                    break;
                default:
                    throw `Invalid level: ${this._levelManager.currentLevel}`;
            }
        }

        private handleClick(evt: createjs.MouseEvent): void {
            let bubble = this._dragon.shootBubbleTo(new Point(evt.stageX, evt.stageY));
            this.lockShapes(() => {
                this._bubbles.push(bubble);
            });
            this.addChild(bubble);
            console.debug(this._bubbles);

            bubble.on(Bubble.EventPopped, () => this.removeShape(bubble), this);
            bubble.on(Bubble.EventAscended, () => this.removeShape(bubble), this);
            bubble.on(Bubble.EventRescuedAnimal, () => {
                this._scoresBar.increaseScore();
                this.removeShape(bubble.getAnimal(), bubble);
            }, this);
            bubble.move();
        }

        private removeShape(...shapes: Shape[]): void {
            this.lockShapes(() => {
                for (let shape of shapes) {
                    this.removeChild(shape);

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

        private static getRandomX(): number {
            let x: number;
            x = (Math.random() * 324627938) % getCanvasDimensions()[0];
            return x;
        }

        private static getRandomY(): number {
            let y: number;
            y = (Math.random() * 876372147) % getCanvasDimensions()[1];
            return y;
        }

        private lockShapes(f: Function) {
            this._isShapesLockFree = false;
            f();
            this._isShapesLockFree = true;
        }

        private findAnimalsCollidingWithBubble(bubble: Bubble): Animal[] {
            const centersDistance = Bubble.Radius + Animal.Radius;
            let circle1Center = new Point(bubble.x, bubble.y);

            let isAnimalColliding = (a: Animal) => {
                let circle2Center = new Point(a.x, a.y);
                return findDistance(circle1Center, circle2Center) <= centersDistance;
            };

            return this._animals.filter(isAnimalColliding);
        }

        private isCollidingWithAnyLava(lavas: Lava[]) {
            return (b: Bubble) => (lavas
                .filter(l => Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30)
                .length > 0);
        }
    }
}
