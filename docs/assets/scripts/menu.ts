namespace BubbleGunner.Menu {
    import Shape = createjs.Shape;
    import Text = createjs.Text;
    import SpriteSheet = createjs.SpriteSheet;
    import Sprite = createjs.Sprite;
    import Sound = createjs.Sound;
    export class MenuScene extends Scene {
        private _btnStartGame: Shape;
        private _btnStartHelp: Shape;
        private _music;
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
                .drawRect(0,0,120,80);
            this._btnStartHelp.x = 360;
            this._btnStartHelp.y = 200;

            let startHelpText = new Text("Help", "20pt Calibri", "blue");
            startHelpText.x = this._btnStartHelp.x + startHelpText.getMeasuredWidth()/2;
            startHelpText.y = this._btnStartHelp.y + startHelpText.getMeasuredHeight()/2;
            this._btnStartHelp.cursor = "pointer";
            this._btnStartHelp.on("click", this.dispatchStartHelpEvent, this);
            let data = {
                "images": [loader.getResult(`pig0`), loader.getResult(`pig1`)],
                "frames": [
                    [2, 2, 252, 252, 0],
                    [258, 2, 252, 252, 0],
                    [514, 2, 252, 252, 0],
                    [770, 2, 252, 252, 0],
                    [1026, 2, 252, 252, 0],
                    [1282, 2, 252, 252, 0],
                    [1538, 2, 252, 252, 0],
                    [1794, 2, 252, 252, 0],
                    [2, 258, 252, 252, 0],
                    [258, 258, 252, 252, 0],
                    [514, 258, 252, 252, 0],
                    [770, 258, 252, 252, 0],
                    [1026, 258, 252, 252, 0],
                    [1282, 258, 252, 252, 0],
                    [1538, 258, 252, 252, 0],
                    [1794, 258, 252, 252, 0],
                    [2, 514, 252, 252, 0],
                    [258, 514, 252, 252, 0],
                    [514, 514, 252, 252, 0],
                    [770, 514, 252, 252, 0],
                    [1026, 514, 252, 252, 0],
                    [1282, 514, 252, 252, 0],
                    [1538, 514, 252, 252, 0],
                    [1794, 514, 252, 252, 0],
                    [2, 770, 252, 252, 0],
                    [258, 770, 252, 252, 0],
                    [514, 770, 252, 252, 0],
                    [770, 770, 252, 252, 0],
                    [1026, 770, 252, 252, 0],
                    [1282, 770, 252, 252, 0],
                    [1538, 770, 252, 252, 0],
                    [1794, 770, 252, 252, 0],
                    [2, 1026, 252, 252, 0],
                    [258, 1026, 252, 252, 0],
                    [514, 1026, 252, 252, 0],
                    [770, 1026, 252, 252, 0],
                    [1026, 1026, 252, 252, 0],
                    [1282, 1026, 252, 252, 0],
                    [1538, 1026, 252, 252, 0],
                    [1794, 1026, 252, 252, 0],
                    [2, 1282, 252, 252, 0],
                    [258, 1282, 252, 252, 0],
                    [514, 1282, 252, 252, 0],
                    [770, 1282, 252, 252, 0],
                    [1026, 1282, 252, 252, 0],
                    [1282, 1282, 252, 252, 0],
                    [1538, 1282, 252, 252, 0],
                    [1794, 1282, 252, 252, 0],
                    [2, 1538, 252, 252, 0],
                    [258, 1538, 252, 252, 0],
                    [514, 1538, 252, 252, 0],
                    [770, 1538, 252, 252, 0],
                    [1026, 1538, 252, 252, 0],
                    [1282, 1538, 252, 252, 0],
                    [1538, 1538, 252, 252, 0],
                    [1794, 1538, 252, 252, 0],
                    [2, 1794, 252, 252, 0],
                    [258, 1794, 252, 252, 0],
                    [514, 1794, 252, 252, 0],
                    [770, 1794, 252, 252, 0],
                    [1026, 1794, 252, 252, 0],
                    [1282, 1794, 252, 252, 0],
                    [1538, 1794, 252, 252, 0],
                    [1794, 1794, 252, 252, 0],
                    [2, 2, 252, 252, 1],
                    [258, 2, 252, 252, 1],
                    [514, 2, 252, 252, 1],
                    [770, 2, 252, 252, 1],
                    [1026, 2, 252, 252, 1],
                    [1282, 2, 252, 252, 1],
                    [1538, 2, 252, 252, 1],
                    [1794, 2, 252, 252, 1],
                    [2, 258, 252, 252, 1],
                    [258, 258, 252, 252, 1],
                    [514, 258, 252, 252, 1],
                    [770, 258, 252, 252, 1],
                    [1026, 258, 252, 252, 1],
                    [1282, 258, 252, 252, 1],
                    [1538, 258, 252, 252, 1],
                    [1794, 258, 252, 252, 1],
                    [2, 514, 252, 252, 1],
                    [258, 514, 252, 252, 1],
                    [514, 514, 252, 252, 1],
                    [770, 514, 252, 252, 1],
                    [1026, 514, 252, 252, 1],
                    [1282, 514, 252, 252, 1],
                    [1538, 514, 252, 252, 1],
                    [1794, 514, 252, 252, 1],
                    [2, 770, 252, 252, 1],
                    [258, 770, 252, 252, 1],
                    [514, 770, 252, 252, 1],
                    [770, 770, 252, 252, 1],
                    [1026, 770, 252, 252, 1],
                    [1282, 770, 252, 252, 1],
                    [1538, 770, 252, 252, 1],
                    [1794, 770, 252, 252, 1],
                    [2, 1026, 252, 252, 1],
                    [258, 1026, 252, 252, 1],
                    [514, 1026, 252, 252, 1],
                    [770, 1026, 252, 252, 1],
                    [1026, 1026, 252, 252, 1],
                    [1282, 1026, 252, 252, 1],
                    [1538, 1026, 252, 252, 1],
                    [1794, 1026, 252, 252, 1],
                    [2, 1282, 252, 252, 1],
                    [258, 1282, 252, 252, 1],
                    [514, 1282, 252, 252, 1],
                    [770, 1282, 252, 252, 1],
                    [1026, 1282, 252, 252, 1],
                    [1282, 1282, 252, 252, 1],
                    [1538, 1282, 252, 252, 1],
                    [1794, 1282, 252, 252, 1],
                    [2, 1538, 252, 252, 1],
                    [258, 1538, 252, 252, 1],
                    [514, 1538, 252, 252, 1],
                    [770, 1538, 252, 252, 1],
                    [1026, 1538, 252, 252, 1],
                    [1282, 1538, 252, 252, 1],
                    [1538, 1538, 252, 252, 1],
                    [1794, 1538, 252, 252, 1],
                    [2, 1794, 252, 252, 1],
                    [258, 1794, 252, 252, 1],
                    [514, 1794, 252, 252, 1],
                    [770, 1794, 252, 252, 1],
                    [1026, 1794, 252, 252, 1],
                    [1282, 1794, 252, 252, 1],
                    [1538, 1794, 252, 252, 1]
                ],
                "animations": {
                    "all": {
                        "frames": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126],
                        "speed": .4
                    }
                }
            };

            let spriteSheet = new SpriteSheet(data);
            let sprite = new Sprite(spriteSheet, `all`);
            sprite.x = 200;
            sprite.y = 60;

            // var sounds = [{
            //     src:"sounds/bgm.mp3", data: {
            //         audioSprite: [
            //             {id:"intro", startTime:0, duration:500},
            //             {id:"loopback", startTime:4000, duration:145000},
            //         ]}
            // }
            // ];

            Sound.on("fileload", this.soundHandler, this);
            //Sound.registerPlugins([createjs.WebAudioPlugin]);
            //Sound.registerSound(sounds, "bgm");
            this._music = Sound.play("bgm");
            this._music.volume = 0.00001;
            this._music.pan = 0.0000001;
            this.addChild(this._btnStartGame,startGameText, sprite);
            this.addChild(this._btnStartHelp, startHelpText);
        }

        private soundHandler(event) {
            this._music = Sound.play("bpm");
            this._music.on("complete", this.bgmLoop, this);
        }

        private bgmLoop(event) {
            this._music = Sound.play("loopback");
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