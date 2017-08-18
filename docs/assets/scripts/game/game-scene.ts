namespace BubbleGunner.Game {
    import Shape = createjs.Shape;
    import Tween = createjs.Tween;
    import Text = createjs.Text;
    import Bitmap = createjs.Bitmap;
    import MouseEvent = createjs.MouseEvent;
    import AbstractSoundInstance = createjs.AbstractSoundInstance;
    import DisplayObject = createjs.DisplayObject;
    import Point = createjs.Point;

    export class GameScene extends SceneBase {
        private _levelManager: LevelManager = new LevelManager();
        private _scoresBar: ScoresBar;
        private _dragon: Dragon;
        private _pauseButton: Bitmap;
        private _bgMusic: AbstractSoundInstance;
        private _animals: Animal[] = [];
        private _bubbles: Bubble[] = [];
        private _lavaPieces: LavaPiece[] = [];
        private _levelText: Text;
        private _isShapesLockFree: boolean = true;

        private _animalRainInterval: number;
        private _lavaRainInterval: number;
        private _tickListener: Function;
        private _mouseMoveListener: Function;
        private _mouseUpListener: Function;
        private _scoresBarListener: Function;
        private _pauseButtonListener: Function;
        private _bgMusicListener: Function;
        private _levelListener: Function;

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
            this._pauseButtonListener = this._pauseButton.on(`click`, () => {
                playSound(SoundAsset.ButtonClick);
                this.changeGameScene(SceneType.Menu);
            }, this);
            this.addChild(this._pauseButton);
            this.setChildIndex(this._pauseButton, 3);

            this._tickListener = this.on(`tick`, this.handleTick, this);
        }

        public start(...args: any[]): void {
            this.alpha = -1;
            this.scaleX = this.scaleY = 10;
            Tween.get(this).to({
                scaleX: 1,
                scaleY: 1,
                alpha: 1
            }, 1000);

            this._mouseMoveListener = this.stage.on(`stagemousemove`, this._dragon.aimGun, this._dragon);
            this._mouseUpListener = this.stage.on(`stagemouseup`, this.handleClick, this);

            this._levelListener = this._levelManager.on(LevelManager.EventLevelChanged, this.showLevelChangedDemo, this);

            this.playBackgroundMusic();

            this.startRain();
            let t = new Pterodactyl(new Point(-100, 700));
            this.addChild(t);
            t.flyTo(new Point(850, 0));
        }

        private startRain(): void {
            this._animalRainInterval = setInterval(this.handleAnimalRainInterval.bind(this), 2.3 * 1000);
            this._lavaRainInterval = setInterval(this.handleLavaRainInterval.bind(this), 3.5 * 1000);
        }

        private stopRain(): void {
            clearInterval(this._animalRainInterval);
            clearInterval(this._lavaRainInterval);
        }

        private changeGameScene(toScene: SceneType): void {
            this.off(`tick`, this._tickListener);
            this.stage.off(`stagemousemove`, this._mouseMoveListener);
            this.stage.off(`stagemouseup`, this._mouseUpListener);
            this._scoresBar.off(ScoresBar.EventNoLifeLeft, this._scoresBarListener);
            this._bgMusic.off(`complete`, this._bgMusicListener);
            this._pauseButton.off(`click`, this._pauseButtonListener);
            this._levelManager.off(LevelManager.EventLevelChanged, this._levelListener);

            this.stopRain();

            this._bgMusic.stop();
            this.removeAllChildren();

            this._bubbles.length = this._animals.length = this._lavaPieces.length = 0;

            // ToDo: Clear up all events handlers, and etc

            switch (toScene) {
                case SceneType.Menu:
                    this.dispatchEvent(new SceneEvent(SceneBase.EventChangeScene, SceneType.Menu));
                    break;
                case SceneType.GameOver:
                    this.dispatchEvent(new SceneEvent(SceneBase.EventChangeScene, SceneType.GameOver, this._scoresBar.getScore()));
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
                let lava = new LavaPiece(GameScene.getRandomX());
                this.lockShapes(() => this._lavaPieces.push(lava));
                this.addChild(lava);
                this.setChildIndex(lava, 2);
                console.debug(this._lavaPieces);

                lava.on(LavaPiece.EventFell, () => this.removeShape(lava), this);
                lava.moveTo(new Point(GameScene.getRandomX(), NormalHeight + LavaPiece.Radius));
                playSound(SoundAsset.LavaPieceFall)
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
                    setTimeout(throwLava, 1.2 * 1000);
                    break;
                default:
                    throw `Invalid level: ${this._levelManager.currentLevel}`;
            }
        }

        private handleClick(evt: MouseEvent): void {
            if (!this._dragon.isReadyToShoot()) return;

            let pauseBtnLocalPoint = this._pauseButton.globalToLocal(this.stage.mouseX, this.stage.mouseY);
            if (this._pauseButton.hitTest(pauseBtnLocalPoint.x, pauseBtnLocalPoint.y)) return;

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

            playSound(SoundAsset.BubbleShoot);
            bubble.move();
        }

        private playBackgroundMusic(): void {
            this._bgMusic = playSound(SoundAsset.GameBgMusic);
            this._bgMusic.loop = -1;
            this._bgMusic.volume = .5;
            this._bgMusic.pan = .5;
        }

        private handleAnimalFall(evt: Event) {
            let animal: Animal = evt.target as Animal;
            this._scoresBar.decreaseRemainingLives();
            this.removeShape(animal);
        }

        private showLevelChangedDemo(): void {
            this.stopRain();

            let intervalHandler: number;
            intervalHandler = setInterval(() => {
                if (this._animals.length !== 0) return;
                clearInterval(intervalHandler);

                this._levelText = new Text(undefined, `bold 24px Permanent Marker`, `yellow`); // ToDo: font, size
                this._levelText.text = `Level ${this._levelManager.currentLevel}`;
                this._levelText.regX = this._levelText.getMeasuredWidth() / 2;
                this._levelText.regY = this._levelText.getMeasuredHeight() / 2;

                this._levelText.x = NormalWidth / 2;
                this._levelText.y = NormalHeight / 2;

                Tween.get(this._levelText)
                    .to({
                        scaleX: 5,
                        scaleY: 5,
                        alpha: 0
                    }, 2.5 * 1000)
                    .call(() => {
                        this.removeChild(this._levelText);
                        this.startRain();
                    });

                this.addChild(this._levelText);
                playSound(SoundAsset.Volcano);
            }, 200);
        }

        private removeShape(...objects: DisplayObject[]): void {
            this.lockShapes(() => {
                for (let shape of objects) {
                    this.removeChild(shape);

                    if (shape instanceof Bubble) {
                        this._bubbles = this._bubbles
                            .filter(b => b !== shape && b != undefined);

                        console.debug(this._bubbles);
                    } else if (shape instanceof Animal) {
                        this._animals = this._animals
                            .filter(a => a !== shape && a != undefined);

                        console.debug(this._animals);
                    } else if (shape instanceof LavaPiece) {
                        this._lavaPieces = this._lavaPieces
                            .filter(l => l !== shape && l != undefined);

                        console.debug(this._lavaPieces);
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
                this._bubbles
                    .filter(b => !b.isPopping)
                    .filter(this.isCollidingWithAnyLavaPiece(this._lavaPieces))
                    .forEach(this.popBubble.bind(this));

                this._bubbles
                    .filter(this.isNotCollidingWithOtherBubbles(this._bubbles))
                    .map(b => [b, this.findClosestAnimalCollidingWithBubble(b, this._animals)])
                    .filter(this.tupleHasValues)
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

        private isCollidingWithAnyLavaPiece(lavaPieces: LavaPiece[]) {
            const centersDistance = Bubble.Radius + LavaPiece.Radius;
            return (b: Bubble) => {
                return lavaPieces.some(l => getObjectsDistance(b, l) <= centersDistance);
            }
        }

        private popBubble(bubble: Bubble): void {
            // console.debug(`lava is popping ${bubble.name}`);
            if (!bubble.containsAnimal) {
                this._dragon.setGunFireDelay(1.5 * 1000);
            }
            bubble.pop();
        }

        private isNotCollidingWithOtherBubbles(allBubbles: Bubble[]) {
            const centersDistance = Bubble.Radius * 2;

            return (bubble: Bubble) => {
                let circle1Center = new Point(bubble.x, bubble.y);
                let isCollidingWithBubble = (b: Bubble) => {
                    let circle2Center = new Point(b.x, b.y);
                    return getPointsDistance(circle1Center, circle2Center) <= centersDistance;
                };

                return (allBubbles
                    .filter(b => b !== bubble)
                    .filter(isCollidingWithBubble)
                    .length === 0);
            };
        }

        private findClosestAnimalCollidingWithBubble(bubble: Bubble, animals: Animal[]): Animal {
            const centersDistance = Bubble.Radius + Animal.Radius;
            return animals
                .map(a => [a, getObjectsDistance(bubble, a)])
                .filter(tuple => (tuple[1] as number) < centersDistance)
                .sort((tupleA, tupleB) => {
                    if (tupleA[1] < tupleB[1]) return -1;
                    if (tupleA[1] === tupleB[1]) return 0;
                    return 1;
                })
                .map(tuple => tuple[0] as Animal)
                .shift();
        }

        private tupleHasValues(tuple: Array<DisplayObject>): boolean {
            return tuple.every(val => val != undefined);
        }
    }
}
