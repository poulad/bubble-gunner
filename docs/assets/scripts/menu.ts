namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Bitmap = createjs.Bitmap;
    import Graphics = createjs.Graphics;
    import Tween = createjs.Tween;
    import Sound = createjs.Sound;
    import SpriteSheet = createjs.SpriteSheet;
    import Sprite = createjs.Sprite;

    export class MenuScene extends Scene {
        private _btnStartGame: Bitmap;
        private _btnHelp: Bitmap;
        private _dragon: Sprite;

        constructor() {
            super();

            let bgColor = new Graphics()
                .beginFill('lightblue')
                .drawRect(0, 0, NormalWidth, NormalHeight);
            this.addChild(new Shape(bgColor));

            let bgImage = new Bitmap(loader.getResult(`menu-volcano`));
            this.addChild(bgImage);

            this._btnStartGame = new Bitmap(loader.getResult(`menu-start`));
            this._btnStartGame.regX = this._btnStartGame.image.width / 2;
            this._btnStartGame.regY = this._btnStartGame.image.height / 2;
            this._btnStartGame.x = NormalWidth / 2;
            this._btnStartGame.y = NormalHeight / 2;
            this._btnStartGame.cursor = `pointer`;
            setInterval(this.pulse.bind(this), 120);
            this._btnStartGame.on(`click`, this.onStartButtonClick, this);
            this.addChild(this._btnStartGame);

            this._btnHelp = new Bitmap(loader.getResult(`menu-help`));
            this._btnHelp.x = NormalWidth - this._btnHelp.image.width - 50;
            this._btnHelp.y = 50;
            this._btnHelp.cursor = "pointer";
            this._btnHelp.on("click", this.onHelpButtonClick, this);
            this.addChild(this._btnHelp);

            let data = {
                images: [loader.getResult(`menu-dragon`)],
                frames: [
                    // Cheer
                    [0, 0, 552, 674],
                    [552, 0, 552, 674],
                    [0, 0, 552, 674],

                    // Run
                    [0, 674, 552, 674],
                    [552, 674, 552, 674]
                ],
                framerate: 4,
                animations: {
                    cheer: [0, 2, `run`],
                    runCheer: [3, 4, `cheer`],
                    run: [3, 4],
                }
            };
            this._dragon = new Sprite(new SpriteSheet(data));
            this._dragon.regX = 226;
            this._dragon.regY = 337;

            const n = 9;
            this._dragon.x = (n - 3) * NormalWidth / n;
            this._dragon.y = NormalHeight - 190;
            this._dragon.scaleX = this._dragon.scaleY = .4;

            this.addChild(this._dragon);
        }

        public start(...args: any[]): void {
            this._dragon.on(`animationend`, this.moveDragon, this);
            this._dragon.gotoAndPlay(`run`);

            this.moveDragon(undefined);
        }

        private onStartButtonClick(): void {
            Sound.play(`sound-button`);
            Tween.get(this)
                .to({
                    alpha: 0,
                    scaleX: 10,
                    scaleY: 10
                }, 2 * 1000)
                .call(() => {
                    this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Game));
                });
        }

        private onHelpButtonClick(): void {
            Sound.play(`sound-button`);
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Help));
        }

        private moveDragon(evt: any): void {
            if (evt && evt.name !== `cheer`) return;

            console.debug(`Dragon running to other side`);
            const n = 9;

            let newX = this._dragon.scaleX > 0 ? 3 * NormalWidth / n : (n - 3) * NormalWidth / n;
            Tween.get(this._dragon).to({
                x: newX
            }, 2.5 * 1000)
                .call(() => {
                    this._dragon.gotoAndPlay(`cheer`);
                    this._dragon.scaleX *= -1;
                });
        }

        private pulse(): void {
            let newScale = this._btnStartGame.scaleX + 0.05;
            if (newScale >= 1.2) newScale = 1;

            Tween.get(this._btnStartGame).to({
                scaleX: newScale,
                scaleY: newScale
            }, 110);

            let newAlpha = this._btnHelp.alpha - .08;
            if (newAlpha < .9) newAlpha = 1;
            Tween.get(this._btnHelp).to({alpha: newAlpha}, 110);
        }
    }
}