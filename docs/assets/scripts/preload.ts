namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Text = createjs.Text;
    import Tween = createjs.Tween;

    export class PreloadScene extends Scene {
        private _circle: Shape;
        private _text: Text;
        private _percent = 0;
        private _intervalHandle: number;

        private static Radius: number = 50;

        constructor() {
            super();

            this._circle = new Shape();
            this._circle.graphics
                .setStrokeStyle(5)
                .beginStroke(`rgba(200, 200, 200, .4)`)
                .beginFill(`lightblue`)
                .drawCircle(0, 0, PreloadScene.Radius);
            this._circle.x = NormalWidth / 2;
            this._circle.y = NormalHeight / 2;

            this._text = new Text(`0 %`, `20px Arial`, '#444');
            this._text.x = this._text.y = -100;

            this.addChild(this._circle, this._text);
        }

        public start(...args: any[]): void {
            this._intervalHandle = setInterval(this.increasePercentage.bind(this), 150);
        }

        private increasePercentage(): void {
            this._percent += Math.floor(1 + (Math.random() * 349875349) % 8);

            if (this._percent >= 100) {
                this._percent = 100;
                clearInterval(this._intervalHandle);
            }

            this.updatePercentTo(this._percent);
        }

        private updatePercentTo(percent: number) {
            const maxRadius = 500;

            let scaleFactor = (this._circle.scaleX + (percent * 10)) / 100;
            const tween: Tween = Tween.get(this._circle)
                .to({
                    scaleX: scaleFactor,
                    scaleY: scaleFactor,
                }, 150);

            this._text.text = `${this._percent} %`;
            this._text.x = NormalWidth / 2 - this._text.getMeasuredWidth() / 2;
            this._text.y = NormalHeight / 2 - this._text.getMeasuredHeight() / 2;

            if (percent === 100) {
                tween.call(() =>
                    setTimeout(() => this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Menu))
                        , 300));

            }
        }
    }
}