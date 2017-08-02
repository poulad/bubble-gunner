namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import MouseEvent = createjs.MouseEvent;
    import Text = createjs.Text;

    export class MenuScene extends Scene {
        private _btnStartGame: Shape;

        constructor() {
            super();

            this._btnStartGame = new Shape();
            this._btnStartGame.graphics
                .beginStroke(`yellow`)
                .beginFill(`#eee`)
                .drawRect(0, 0, 120, 80);
            this._btnStartGame.x = 360;
            this._btnStartGame.y = 100;
            let startGameText = new Text(`Start Shooting Bubbles`, `Sans 15pt`, `red`);
            startGameText.x = 370;
            startGameText.y = 120;

            this._btnStartGame.cursor = `pointer`;

            this._btnStartGame.on(`click`, this.dispatchStartGameEvent, this);
            this.addChild(this._btnStartGame, startGameText);
        }

        public start(...args: any[]): void {

        }

        private dispatchStartGameEvent(): void {
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Game));
        }
    }
}