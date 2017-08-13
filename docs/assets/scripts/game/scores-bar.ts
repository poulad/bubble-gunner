namespace BubbleGunner.Game {
    import Shape = createjs.Shape;
    import Tween = createjs.Tween;
    import Container = createjs.Container;
    import Text = createjs.Text;
    import Bitmap = createjs.Bitmap;

    export class ScoresBar extends Container {
        public static EventNoLifeLeft: string = `noLifeLeft`;

        private _mask: Bitmap;
        private _bar: Shape;
        private _scoreText: Text;
        private _hearts: Bitmap[] = [];

        constructor(private _levelManager: LevelManager, private _score: number = 0, private _remainingLives: number = 4) {
            super();
            this.name = `Scores bar ${generateId()}`;

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

            this._scoreText = new Text(this._score.toString(), `20px Permanent Marker`, 'white');
            this._scoreText.x = this._mask.getBounds().width + 10;

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
            playSound(SoundAsset.Score);
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
}