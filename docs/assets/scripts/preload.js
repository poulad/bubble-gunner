var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BubbleGunner;
(function (BubbleGunner) {
    var Menu;
    (function (Menu) {
        var Shape = createjs.Shape;
        var Text = createjs.Text;
        var Tween = createjs.Tween;
        var LoadQueue = createjs.LoadQueue;
        var Sound = createjs.Sound;
        var PreloadScene = (function (_super) {
            __extends(PreloadScene, _super);
            function PreloadScene() {
                var _this = _super.call(this) || this;
                _this._circle = new Shape();
                _this._circle.graphics
                    .setStrokeStyle(5)
                    .beginStroke("rgba(200, 200, 200, .4)")
                    .beginFill("lightblue")
                    .drawCircle(0, 0, PreloadScene.Radius);
                _this._circle.x = BubbleGunner.NormalWidth / 2;
                _this._circle.y = BubbleGunner.NormalHeight / 2;
                _this._text = new Text("0 %", "20px Arial", '#444');
                _this._text.x = _this._text.y = -100;
                _this.addChild(_this._circle, _this._text);
                return _this;
            }
            PreloadScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                BubbleGunner.loader = new LoadQueue(true, "assets/");
                BubbleGunner.loader.installPlugin(createjs.Sound);
                Sound.alternateExtensions = ["mp3"];
                BubbleGunner.loader.on("progress", this.updateProgress, this);
                BubbleGunner.loader.on("complete", this.changeToMenuScene, this);
                BubbleGunner.loader.loadManifest([
                    { id: "sound-button", src: "sounds/button.ogg" },
                    { id: "dragon", src: "images/dragon.png" },
                    { id: "dragon-hand", src: "images/dragon-hand.png" },
                    { id: "volcano", src: "images/volcano.png" },
                    { id: "heart", src: "images/heart.png" },
                    // Menu
                    { id: "menu-volcano", src: "images/volcano-menu.png" },
                    { id: "menu-start", src: "images/start.png" },
                    { id: "menu-help", src: "images/help.png" },
                    // Game - Images
                    { id: "back", src: "images/back.png" },
                    { id: "pause", src: "images/pause.png" },
                    { id: "refresh", src: "images/refresh.png" },
                    { id: "scoresbar", src: "images/scoresbar.png" },
                    // Game - Sounds
                    { id: "game-bgm", src: "sounds/bgm.ogg" },
                    { id: "game-bubble-shoot", src: "sounds/bubble-shoot.ogg" },
                    { id: "game-lava-fall", src: "sounds/lava-fall.ogg" },
                ]);
            };
            PreloadScene.prototype.updateProgress = function (evt) {
                var percent = Math.floor(evt.loaded * 100);
                var scaleFactor = (this._circle.scaleX + (percent * 10)) / 100;
                var tween = Tween.get(this._circle)
                    .to({
                    scaleX: scaleFactor,
                    scaleY: scaleFactor,
                }, 150);
                this._text.text = percent + " %";
                this._text.x = BubbleGunner.NormalWidth / 2 - this._text.getMeasuredWidth() / 2;
                this._text.y = BubbleGunner.NormalHeight / 2 - this._text.getMeasuredHeight() / 2;
            };
            PreloadScene.prototype.changeToMenuScene = function () {
                var _this = this;
                Tween.removeTweens(this._circle);
                Tween.get(this._circle)
                    .to({ scaleX: 10, scaleY: 10 }, 200)
                    .call(function () { return setTimeout(function () {
                    return _this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Menu));
                }, 400); });
            };
            PreloadScene.Radius = 50;
            return PreloadScene;
        }(BubbleGunner.Scene));
        Menu.PreloadScene = PreloadScene;
    })(Menu = BubbleGunner.Menu || (BubbleGunner.Menu = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=preload.js.map