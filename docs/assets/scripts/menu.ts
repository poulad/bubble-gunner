namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Text = createjs.Text;
    import SpriteSheet = createjs.SpriteSheet;
    import Sprite = createjs.Sprite;

    export class MenuScene extends Scene {
        private _btnStartGame: Shape;
        private _btnStartHelp: Shape;

        constructor() {
            super();

            this._btnStartGame = new Shape();
            this._btnStartGame.graphics
                .beginStroke(`yellow`)
                .beginFill(`#eee`)
                .drawRect(0, 0, 120, 80);
            this._btnStartGame.x = 360;
            this._btnStartGame.y = 100;

            let startGameText = new Text(`Start Game`, `10pt Calibri`, `red`);
            startGameText.x = 370;
            startGameText.y = 120;

            this._btnStartGame.cursor = `pointer`;
            this._btnStartGame.on(`click`, this.dispatchStartGameEvent, this);

            this._btnStartHelp = new Shape();
            this._btnStartHelp.graphics
                .beginStroke("blue")
                .beginFill("#eee")
                .drawRect(0, 0, 120, 80);
            this._btnStartHelp.x = 360;
            this._btnStartHelp.y = 200;

            let startHelpText = new Text("Help", "20pt Calibri", "blue");
            startHelpText.x = this._btnStartHelp.x + startHelpText.getMeasuredWidth() / 2;
            startHelpText.y = this._btnStartHelp.y + startHelpText.getMeasuredHeight() / 2;
            this._btnStartHelp.cursor = "pointer";
            this._btnStartHelp.on("click", this.dispatchStartHelpEvent, this);

            this.addChild(this._btnStartGame, startGameText);
            this.addChild(this._btnStartHelp, startHelpText);
        }

        public start(...args: any[]): void {

        }

        private dispatchStartGameEvent(): void {
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Game));
        }

        private dispatchStartHelpEvent(): void {
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Help));
        }
    }
}