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
        var PreloadScene = (function (_super) {
            __extends(PreloadScene, _super);
            function PreloadScene() {
                var _this = _super.call(this) || this;
                _this._percent = 0;
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
                this._intervalHandle = setInterval(this.increasePercentage.bind(this), 150);
            };
            PreloadScene.prototype.increasePercentage = function () {
                this._percent += Math.floor(1 + (Math.random() * 349875349) % 8);
                if (this._percent >= 100) {
                    this._percent = 100;
                    clearInterval(this._intervalHandle);
                }
                this.updatePercentTo(this._percent);
            };
            PreloadScene.prototype.updatePercentTo = function (percent) {
                var _this = this;
                var maxRadius = 500;
                var scaleFactor = (this._circle.scaleX + (percent * 10)) / 100;
                var tween = Tween.get(this._circle)
                    .to({
                    scaleX: scaleFactor,
                    scaleY: scaleFactor,
                }, 150);
                this._text.text = this._percent + " %";
                this._text.x = BubbleGunner.NormalWidth / 2 - this._text.getMeasuredWidth() / 2;
                this._text.y = BubbleGunner.NormalHeight / 2 - this._text.getMeasuredHeight() / 2;
                if (percent === 100) {
                    tween.call(function () {
                        return setTimeout(function () { return _this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Menu)); }, 300);
                    });
                }
            };
            PreloadScene.Radius = 50;
            return PreloadScene;
        }(BubbleGunner.Scene));
        Menu.PreloadScene = PreloadScene;
    })(Menu = BubbleGunner.Menu || (BubbleGunner.Menu = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=preload.js.map