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
    var GameOver;
    (function (GameOver) {
        var Bitmap = createjs.Bitmap;
        var Tween = createjs.Tween;
        var Text = createjs.Text;
        var Sound = createjs.Sound;
        var GameOverScene = (function (_super) {
            __extends(GameOverScene, _super);
            function GameOverScene() {
                var _this = _super.call(this) || this;
                _this._pulseCount = 0;
                var text = new Text("GAME OVER", "bold 80px Arial", "#f57");
                var textSize = text.getBounds();
                text.x = BubbleGunner.NormalWidth / 2 - textSize.width / 2;
                text.y = 30;
                _this.addChild(text);
                _this._refreshButton = new Bitmap(BubbleGunner.loader.getResult("refresh"));
                _this._refreshButton.regX = _this._refreshButton.getBounds().width / 2;
                _this._refreshButton.regY = _this._refreshButton.getBounds().height / 2;
                _this._refreshButton.x = BubbleGunner.NormalWidth / 2;
                _this._refreshButton.y = BubbleGunner.NormalHeight / 2;
                _this._refreshButton.on("click", _this.dispatchPlayGameEvent, _this);
                _this._refreshButton.cursor = "pointer";
                _this.addChild(_this._refreshButton);
                return _this;
            }
            GameOverScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this._pulseIntervalHandle = setInterval(this.pulse.bind(this), 60);
            };
            GameOverScene.prototype.dispatchPlayGameEvent = function () {
                Sound.play("sound-button");
                clearInterval(this._pulseIntervalHandle);
                this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Game));
            };
            GameOverScene.prototype.pulse = function () {
                var scale = Math.cos(this._pulseCount++ * .1) * 0.4 + 2;
                Tween.get(this._refreshButton)
                    .to({
                    scaleX: scale,
                    scaleY: scale,
                    rotation: -this._pulseCount * 5
                }, 30);
                this._pulseCount++;
            };
            return GameOverScene;
        }(BubbleGunner.Scene));
        GameOver.GameOverScene = GameOverScene;
    })(GameOver = BubbleGunner.GameOver || (BubbleGunner.GameOver = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=game-over.js.map