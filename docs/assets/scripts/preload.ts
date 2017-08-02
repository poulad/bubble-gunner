namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Text = createjs.Text;
    import Tween = createjs.Tween;
    import LoadQueue = createjs.LoadQueue;

    export class PreloadScene extends Scene {
        private _circle: Shape;
        private _text: Text;

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
            queue = new LoadQueue(undefined, `assets/`);
            queue.on(`progress`, this.updateProgress, this);

            queue.loadManifest([
                {
                    id: `dragon`,
                    src: `images/dragon.png`
                },
                {
                    id: `dragon-hand`,
                    src: `images/dragon-hand.png`
                }
            ]);
        }

        private updateProgress(evt: ProgressEvent): void {
            let percent = Math.floor(evt.loaded * 100);
            let scaleFactor = (this._circle.scaleX + (percent * 10)) / 100;

            const tween: Tween = Tween.get(this._circle)
                .to({
                    scaleX: scaleFactor,
                    scaleY: scaleFactor,
                }, 150);

            this._text.text = `${percent} %`;
            this._text.x = NormalWidth / 2 - this._text.getMeasuredWidth() / 2;
            this._text.y = NormalHeight / 2 - this._text.getMeasuredHeight() / 2;

            if (percent === 100) {
                Tween.removeTweens(this._circle);
                Tween.get(this._circle)
                    .to({scaleX: 10, scaleY: 10}, 200)
                    .call(() => setTimeout(() =>
                        this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Menu)), 400)
                    );
            }
        }
    }
}