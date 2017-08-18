namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Text = createjs.Text;
    import Tween = createjs.Tween;
    import LoadQueue = createjs.LoadQueue;
    import Sound = createjs.Sound;

    export class PreloadScene extends SceneBase {
        private static Radius: number = 50;

        private _circle: Shape;
        private _text: Text;
        private _gc: GarbageCollector = new GarbageCollector(this);

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

            this._text = new Text(`0 %`, `40px Permanent Marker`, '#444');
            this._text.x = this._text.y = -100;

            this.addChild(this._circle, this._text);
        }

        public start(...args: any[]): void {
            loader = new LoadQueue(true, `assets/`);
            loader.installPlugin(createjs.Sound);
            Sound.alternateExtensions = ["mp3"];
            this._gc.registerEventListener(loader, `progress`, this.updateProgress, this);
            this._gc.registerEventListener(loader, `complete`, this.changeToMenuScene, this);

            loader.loadManifest([
                // Audiosprite
                {id: `j:audiosprite`, src: `sounds/audiosprite.json`},
                {id: `s:audiosprite`, src: `sounds/audiosprite.ogg`},

                {id: `dragon`, src: `images/dragon.png`},
                {id: `dragon-hand`, src: `images/dragon-hand.png`},
                {id: `volcano`, src: `images/volcano.png`},
                {id: `heart`, src: `images/heart.png`},

                // Menu
                {id: `menu-volcano`, src: `images/volcano-menu.png`},
                {id: `menu-dragon`, src: `images/dragon-menu.png`},
                {id: `menu-start`, src: `images/start.png`},
                {id: `menu-help`, src: `images/help.png`},

                // Help
                {id: `help-guide`, src: `images/help-guide.png`},

                // Game - Images
                {id: `back`, src: `images/back.png`},
                {id: `pause`, src: `images/pause.png`},
                {id: `refresh`, src: `images/refresh.png`},
                {id: `scoresbar`, src: `images/scoresbar.png`},
                {id: `game-lava`, src: `images/lava.png`},
                {id: `game-animal0`, src: `images/animal0.png`},
                {id: `game-animal1`, src: `images/animal1.png`},
                {id: `game-animal2`, src: `images/animal2.png`},
                {id: `game-animal3`, src: `images/animal3.png`},
                // {id: `game-pterodactyl`, src: `images/pterodactyl.png`},
            ]);
        }

        private updateProgress(evt: ProgressEvent): void {
            let percent = Math.floor(evt.loaded * 100);
            let scaleFactor = (this._circle.scaleX + (percent * 10)) / 100;

            Tween.get(this._circle)
                .to({
                    scaleX: scaleFactor,
                    scaleY: scaleFactor,
                }, 150);

            this._text.text = `${percent} %`;
            this._text.x = NormalWidth / 2 - this._text.getMeasuredWidth() / 2;
            this._text.y = NormalHeight / 2 - this._text.getMeasuredHeight() / 2;
        }

        private changeToMenuScene() {
            Tween.removeTweens(this._circle);
            Tween.get(this._circle)
                .to({scaleX: 10, scaleY: 10}, 200)
                .call(() => this._gc.registerTimeout(() =>
                    this.dispatchEvent(new SceneEvent(SceneBase.EventChangeScene, SceneType.Menu)), 400)
                );
        }
    }
}