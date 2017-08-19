namespace BubbleGunner.GameOver {
    import Bitmap = createjs.Bitmap;
    import Tween = createjs.Tween;
    import Text = createjs.Text;

    export class GameOverScene extends SceneBase {
        private _refreshButton: Bitmap;
        private _gameOverText: Text;
        private _pulseIntervalHandle: number;
        private _pulseCount: number = 0;
        private _score: number;
        private _gc: GarbageCollector = new GarbageCollector(this);

        constructor() {
            super();

            this._gameOverText = new Text(`GAME OVER`, `80px Permanent Marker`, `#F57`);
            const textSize = this._gameOverText.getBounds();
            this._gameOverText.x = NormalWidth / 2 - textSize.width / 2;
            this._gameOverText.y = 30;
            this.addChild(this._gameOverText);

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
            this._score = args[0][0][0] as number;

            if (Telegram.Bot.Framework.gameScoreUrlExists()) {
                Telegram.Bot.Framework.sendUserScore(this._score);
            }

            this.drawScore();
        }

        private drawScore(): void {
            const scoreText = new Text(`You Scored: ${this._score}`, `50px Permanent Marker`, `#FEA`);
            const textSize = scoreText.getBounds();
            scoreText.x = NormalWidth / 2 - textSize.width / 2;
            scoreText.y = this._gameOverText.y + this._gameOverText.getMeasuredHeight() + 20;
            this.addChild(scoreText);
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