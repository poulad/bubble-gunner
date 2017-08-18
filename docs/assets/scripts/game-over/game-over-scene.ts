namespace BubbleGunner.GameOver {
    import Bitmap = createjs.Bitmap;
    import Tween = createjs.Tween;
    import Text = createjs.Text;

    export class GameOverScene extends SceneBase {
        private _refreshButton: Bitmap;
        private _pulseIntervalHandle: number;
        private _pulseCount: number = 0;
        private _gc: GarbageCollector = new GarbageCollector(this);

        constructor() {
            super();

            let text = new Text(`GAME OVER`, `80px Permanent Marker`, `#F57`);
            const textSize = text.getBounds();
            text.x = NormalWidth / 2 - textSize.width / 2;
            text.y = 30;
            this.addChild(text);

            this._refreshButton = new Bitmap(loader.getResult(`refresh`));
            this._refreshButton.regX = this._refreshButton.getBounds().width / 2;
            this._refreshButton.regY = this._refreshButton.getBounds().height / 2;
            this._refreshButton.x = NormalWidth / 2;
            this._refreshButton.y = NormalHeight / 2;
            this._gc.registerEventListener(this._refreshButton, `click`, this.dispatchPlayGameEvent, this);
            this._refreshButton.cursor = `pointer`;
            this.addChild(this._refreshButton);
        }

        public start(...args: any[]): void {
            this._pulseIntervalHandle = this._gc.registerInterval(this.pulse.bind(this), 60);

            if (args.length === 1 && Telegram.Bot.Framework.gameScoreUrlExists()) {
                const score = args[0][0][0] as number;
                Telegram.Bot.Framework.sendUserScore(score);
            }
        }

        private dispatchPlayGameEvent(): void {
            playSound(SoundAsset.ButtonClick);
            this._gc.disposeInterval(this._pulseIntervalHandle);
            this.dispatchEvent(new SceneEvent(SceneBase.EventChangeScene, SceneType.Game));
        }

        private pulse(): void {
            let scale = Math.cos(this._pulseCount++ * .1) * 0.4 + 2;
            Tween.get(this._refreshButton)
                .to({
                    scaleX: scale,
                    scaleY: scale,
                    rotation: -this._pulseCount * 5
                }, 30);
            this._pulseCount++;
        }
    }
}