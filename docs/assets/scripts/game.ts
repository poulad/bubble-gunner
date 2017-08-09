namespace BubbleGunner.Game {
    import Shape = createjs.Shape;
    import Tween = createjs.Tween;
    import Container = createjs.Container;
    import Text = createjs.Text;
    import Bitmap = createjs.Bitmap;
    import Ease = createjs.Ease;
    import MouseEvent = createjs.MouseEvent;
    import EventDispatcher = createjs.EventDispatcher;
    import Sound = createjs.Sound;
    import AbstractSoundInstance = createjs.AbstractSoundInstance;
    import Stage = createjs.Stage;

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
        public static Radius: number = 22;

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
            let newEndPoint = new Point(this.endPoint.x, NormalHeight);
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
        private static Speed: number = 400;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;
        private static Width = 25;
        private static Height = 20;

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
        public static Radius: number = 28;

        private static Speed: number = 450;
        private static AscendingSpeed: number = 100;

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

            this.startPoint = from;
            this.x = this.startPoint.x;
            this.y = this.startPoint.y;
            this.endPoint = to;
        }

        public move(): Tween {
            this.on(`tick`, this.handleTick, this);

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

            this.x = this._animal.x;
            this.y = this._animal.y;

            Tween.removeTweens(this);
            Tween.removeTweens(this._animal);

            this.startPoint = new Point(this.x, this.y);
            this.endPoint = new Point(this.x, -Animal.Radius);

            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Bubble.AscendingSpeed))
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventRescuedAnimal)));
        }

        public getAnimal(): Animal {
            return this._animal;
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

        private handleTick(): void {
            if (
                this.x < (0 - Bubble.Radius * this.scaleX) ||
                (NormalWidth + Bubble.Radius * this.scaleX) < this.x
            ) {
                // Bubble is out of the visual horizon of canvas
                this.dispatchEvent(new Event(Bubble.EventAscended));
            }

            if (this.containsAnimal) {
                this._animal.y = this.y;
            }

            this.pulse();
        }

        private pulse(): void {
            let newAlpha = Math.cos(this._pulseCount++ * 0.1) * 0.4 + 0.6;
            Tween.get(this).to({alpha: newAlpha});
            this._pulseCount++;
        }

        private updateEndPoint(): void {
            /*
             line equation:
             y = mx + b
             m = (y2 - y1) / (x2 - x1)
             */

            let finalY = 0; // Bubble goes up
            if (this.endPoint.y >= this.startPoint.y) finalY = NormalHeight; // Bubble goes down

            const m = (this.startPoint.y - this.endPoint.y) / (this.startPoint.x - this.endPoint.x);
            const b = this.endPoint.y - m * this.endPoint.x;

            this.endPoint.y = finalY;
            this.endPoint.x = (this.endPoint.y - b) / m;
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

        private static FireRate: number = 300;

        private _body: Bitmap;
        private _hand: DragonHand;
        private _canShoot: boolean = true;

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
            if (!this._canShoot)
                return;

            this.aimGunToPoint(point);

            let gunMuzzlePoint = this.getGunMuzzleStagePoint();
            let bubble = new Bubble(gunMuzzlePoint, point);
            console.debug(`Shooting bubble from: ${gunMuzzlePoint}`);

            const targetScale = bubble.scaleX;
            bubble.scaleX = bubble.scaleY = .1;
            Tween.get(bubble)
                .to({
                    scaleX: targetScale,
                    scaleY: targetScale,
                }, 150, Ease.bounceOut);
            this.setGunTimeout(Dragon.FireRate);
            return bubble;
        }

        public setGunTimeout(time: number) {
            this._canShoot = false;
            setTimeout(() => {
                if (this)
                    this._canShoot = true;
            }, time);
        }

        public aimGun(evt: MouseEvent): void {
            let stage = evt.target as Stage;
            let stagePoint = new Point(evt.stageX / stage.scaleX, evt.stageY / stage.scaleY);
            // console.debug(`Mouse on stage point: ${stagePoint}`);
            this.aimGunToPoint(stagePoint);
        }

        public isReadyToShoot(): boolean {
            return this._canShoot;
        }

        private aimGunToPoint(targetPoint: Point): void {
            const minAngle = -10;

            let handRegStagePoint = this.getHandRegStagePoint();
            if (handRegStagePoint.x < targetPoint.x) {
                this.scaleX = -Math.abs(this.scaleX);
            } else {
                this.scaleX = Math.abs(this.scaleX);
            }
            handRegStagePoint = this.getHandRegStagePoint();

            let yDiff = targetPoint.y - handRegStagePoint.y;
            let xDiff = targetPoint.x - handRegStagePoint.x;

            let angle = Math.atan(yDiff / xDiff) / Math.PI * 180;
            if (this.scaleX < 0) angle *= -1;
            if (angle < minAngle) angle = minAngle;

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
        public static EventNoLifeLeft: string = `noLifeLeft`;

        private _mask: Bitmap;
        private _bar: Shape;
        private _scoreText: Text;
        private _hearts: Bitmap[] = [];

        constructor(private _levelManager: LevelManager, private _score: number = 0, private _remainingLives: number = 4) {
            super();

            const barMargin = 3;

            this._mask = new Bitmap(loader.getResult(`scoresbar`));
            this.addChild(this._mask);
            this.setChildIndex(this._mask, 2);

            this._bar = new Shape();
            this._bar.graphics
                .beginFill(`yellow`)
                .drawRect(0, 0, .72, this._mask.getBounds().height - barMargin * 2);
            this._bar.scaleX = 0;
            this._bar.x = barMargin;
            this._bar.y = barMargin;
            this.addChild(this._bar);
            this.setChildIndex(this._bar, 1);

            this._scoreText = new Text(this._score.toString(), `20px Arial`, 'white');
            this._scoreText.x = this._mask.getBounds().width + 10;
            this._scoreText.y = 0;
            this.addChild(this._scoreText);
            this.setChildIndex(this._scoreText, 1);


            for (let i = 0; i < _remainingLives; i++) {
                let heart = new Bitmap(loader.getResult(`heart`));
                heart.scaleX = heart.scaleY = .3;
                heart.x = i * 20;
                heart.y = this._mask.getBounds().height + 8;
                this._hearts.push(heart);
                this.addChild(heart);
            }
        }

        public increaseScore(): void {
            this.setScore(this._score + 1);
        }

        public decreaseRemainingLives(): void {
            this.setRemainingLives(this._remainingLives - 1);
        }

        public setScore(score: number): void {
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

        public getScore(): number {
            return this._score;
        }

        public setRemainingLives(n: number): void {
            this._remainingLives = n;
            this._hearts
                .filter((heart, index) => (index + 1) > n)
                .forEach(heart => {
                    Tween.get(heart)
                        .to({alpha: 0, x: -50}, 300)
                        .call(() => {
                            this.removeChild(heart);
                            this._hearts.pop();
                            console.debug(`Hearts left: ${this._hearts.length}`);
                            if (this._hearts.length <= 0) {
                                this.dispatchEvent(new Event(ScoresBar.EventNoLifeLeft));
                            }
                        });
                });
        }

        public getRemainingLives(): number {
            return this._remainingLives;
        }
    }

    export class GameScene extends Scene {
        private _levelManager: LevelManager = new LevelManager();
        private _scoresBar: ScoresBar;
        private _dragon: Dragon;
        private _pauseButton: Bitmap;
        private _bgMusic: AbstractSoundInstance;
        private _animals: Animal[] = [];
        private _bubbles: Bubble[] = [];
        private _lavas: Lava[] = [];
        private _isShapesLockFree: boolean = true;

        private _animalRainInterval: number;
        private _lavaRainInterval: number;
        private _tickListener: Function;
        private _mouseMoveListener: Function;
        private _mouseUpListener: Function;
        private _scoresBarListener: Function;
        private _pauseButtonListener: Function;
        private _bgMusicListener: Function;

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
            this._scoresBarListener = this._scoresBar.on(ScoresBar.EventNoLifeLeft, this.changeGameScene.bind(this, SceneType.GameOver));
            this.addChild(this._scoresBar);
            this.setChildIndex(this._scoresBar, 3);

            this._dragon = new Dragon();
            this._dragon.scaleX = this._dragon.scaleY = .3;
            this._dragon.x = NormalWidth / 2;
            this._dragon.y = NormalHeight - this._dragon.originalHeight * this._dragon.scaleY - 40;
            this.addChild(this._dragon);
            this.setChildIndex(this._dragon, 3);

            this._pauseButton = new Bitmap(loader.getResult(`pause`));
            this._pauseButton.x = 30;
            this._pauseButton.y = NormalHeight - this._pauseButton.getBounds().height - 30;
            this._pauseButton.cursor = `pointer`;
            this._pauseButtonListener = this._pauseButton.on(`click`, this.changeGameScene.bind(this, SceneType.Menu));
            this.addChild(this._pauseButton);
            this.setChildIndex(this._pauseButton, 3);

            this._tickListener = this.on(`tick`, this.handleTick, this);
        }

        public start(...args: any[]): void {
            this._animalRainInterval = setInterval(this.handleAnimalRainInterval.bind(this), 3000);
            this._lavaRainInterval = setInterval(this.handleLavaRainInterval.bind(this), 4000);

            this._mouseMoveListener = this.stage.on(`stagemousemove`, this._dragon.aimGun, this._dragon);
            this._mouseUpListener = this.stage.on(`stagemouseup`, this.handleClick, this);

            this.playBackgroundMusic();
        }

        public changeGameScene(toScene: SceneType): void {
            this.off(`tick`, this._tickListener);
            this.stage.off(`stagemousemove`, this._mouseMoveListener);
            this.stage.off(`stagemouseup`, this._mouseUpListener);
            this._scoresBar.off(ScoresBar.EventNoLifeLeft, this._scoresBarListener);
            this._bgMusic.off(`complete`, this._bgMusicListener);
            this._pauseButton.off(`click`, this._pauseButtonListener);

            clearInterval(this._animalRainInterval);
            clearInterval(this._lavaRainInterval);

            this._bgMusic.stop();
            this.removeAllChildren();

            this._bubbles.length = this._animals.length = this._lavas.length = 0;

            // ToDo: Clear up all events handlers, and etc

            switch (toScene) {
                case SceneType.Menu:
                    this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Menu));
                    break;
                case SceneType.GameOver:
                    this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.GameOver));
                    break;
                default:
                    throw new Error(`Invalid scene type: ${toScene}`);
            }
        }

        private handleAnimalRainInterval() {
            let animal = new Animal(new Point(GameScene.getRandomX(), 0));
            this.lockShapes(() => {
                this._animals.push(animal);
            });
            this.addChild(animal);
            this.setChildIndex(animal, 2);
            console.debug(this._animals);

            animal.on(Animal.EventFell, this.handleAnimalFall, this);
            animal.moveTo(new Point(GameScene.getRandomX(), NormalHeight));
        }

        private handleLavaRainInterval() {
            let throwLava: Function = () => {
                let lava = new Lava(GameScene.getRandomX());
                this.lockShapes(() => this._lavas.push(lava));
                this.addChild(lava);
                this.setChildIndex(lava, 2);
                console.debug(this._lavas);

                lava.on(Lava.EventFell, () => this.removeShape(lava), this);
                lava.moveTo(new Point(GameScene.getRandomX(), NormalHeight));
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
            if (!this._dragon.isReadyToShoot()) return;

            let stagePoint = new Point(
                evt.stageX / this.stage.scaleX,
                evt.stageY / this.stage.scaleY);
            let bubble = this._dragon.shootBubbleTo(stagePoint);
            this.lockShapes(() => {
                this._bubbles.push(bubble);
            });
            this.addChild(bubble);
            this.setChildIndex(bubble, 2);
            console.debug(this._bubbles);

            bubble.on(Bubble.EventPopped, () => this.removeShape(bubble), this);
            bubble.on(Bubble.EventAscended, () => this.removeShape(bubble), this);
            bubble.on(Bubble.EventRescuedAnimal, () => {
                this._scoresBar.increaseScore();
                this.removeShape(bubble.getAnimal(), bubble);
            }, this);
            bubble.move();
        }

        private playBackgroundMusic(): void {
            this._bgMusic = Sound.play(`bgm`);
            this._bgMusicListener = this._bgMusic.on(`complete`, this.playBackgroundMusic, this);
            this._bgMusic.volume = 100;
            this._bgMusic.pan = .5;
        }

        private handleAnimalFall(evt: Event) {
            let animal: Animal = evt.target as Animal;
            this._scoresBar.decreaseRemainingLives();
            this.removeShape(animal);
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
                        console.warn(`Unknown type to remove: ${shape}`);
                    }
                }
            });
        }

        private handleTick(): void {
            if (!this._isShapesLockFree)
                return;

            this.lockShapes(() => {
                if(this.isCollidingWithAnyLava(this._lavas))
                    this._dragon.setGunTimeout(1000);
                this._bubbles
                    .filter(this.isCollidingWithAnyLava(this._lavas))
                    .forEach((b: Bubble) => b.pop());

                this._bubbles
                    .filter(this.isNotCollidingWithOtherBubbles(this._bubbles))
                    .map(b => [b, this.findAnimalsCollidingWithBubble(b, this._animals)])
                    .filter(hasCollisions)
                    .map(tuple => <[Bubble, Animal]>[tuple[0], tuple[1][0]])
                    .forEach((tuple: [Bubble, Animal]) => tuple[0].takeAnimal(tuple[1]));
            });
        }

        private static getRandomX(): number {
            let x: number;
            x = (Math.random() * 324627938) % NormalWidth;
            return x;
        }

        private lockShapes(f: Function) {
            this._isShapesLockFree = false;
            f();
            this._isShapesLockFree = true;
        }

        private isNotCollidingWithOtherBubbles(allBubbles: Bubble[]) {
            const centersDistance = Bubble.Radius * 2;

            return (bubble: Bubble) => {
                let circle1Center = new Point(bubble.x, bubble.y);
                let isCollidingWithBubble = (b: Bubble) => {
                    let circle2Center = new Point(b.x, b.y);
                    return findDistance(circle1Center, circle2Center) <= centersDistance;
                };

                return (allBubbles
                    .filter(b => b !== bubble)
                    .filter(isCollidingWithBubble)
                    .length === 0);
            };
        }

        private findAnimalsCollidingWithBubble(bubble: Bubble, animals: Animal[]): Animal[] {
            const centersDistance = Bubble.Radius + Animal.Radius;
            let circle1Center = new Point(bubble.x, bubble.y);

            let isAnimalColliding = (a: Animal) => {
                let circle2Center = new Point(a.x, a.y);
                return findDistance(circle1Center, circle2Center) <= centersDistance;
            };

            return animals.filter(isAnimalColliding);
        }

        private isCollidingWithAnyLava(lavas: Lava[]) {
            return (b: Bubble) => (lavas
                .filter(l => Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30)
                .length > 0);
        }
    }
}
