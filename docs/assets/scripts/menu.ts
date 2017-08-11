namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Bitmap = createjs.Bitmap;
    import Graphics = createjs.Graphics;
    import Tween = createjs.Tween;
    import Sound = createjs.Sound;

    export class MenuScene extends Scene {
        private _btnStartGame: Bitmap;
        private _btnHelp: Bitmap;

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
            this._btnStartGame.y = NormalHeight / 2 - 100;
            this._btnStartGame.cursor = `pointer`;
            setInterval(this.pulse.bind(this), 120);
            this._btnStartGame.on(`click`, this.onStartButtonClick, this);

            this._btnHelp = new Bitmap(loader.getResult(`menu-help`));
            this._btnHelp.x = 50;
            this._btnHelp.y = NormalHeight - this._btnHelp.image.height - 50;
            this._btnHelp.cursor = "pointer";
            this._btnHelp.on("click", this.onHelpButtonClick, this);

            this.addChild(this._btnStartGame);
            this.addChild(this._btnHelp);
        }

        public start(...args: any[]): void {

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