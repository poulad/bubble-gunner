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
        var Bitmap = createjs.Bitmap;
        var Graphics = createjs.Graphics;
        var Tween = createjs.Tween;
        var MenuScene = (function (_super) {
            __extends(MenuScene, _super);
            function MenuScene() {
                var _this = _super.call(this) || this;
                _this.scale = 0;
                var bgColor = new Graphics()
                    .beginFill('lightblue')
                    .drawRect(0, 0, BubbleGunner.NormalWidth, BubbleGunner.NormalHeight);
                _this.addChild(new Shape(bgColor));
                var bgImage = new Bitmap(BubbleGunner.loader.getResult("menu-volcano"));
                _this.addChild(bgImage);
                _this._btnStartGame = new Bitmap(BubbleGunner.loader.getResult("menu-start"));
                _this._btnStartGame.regX = _this._btnStartGame.image.width / 2;
                _this._btnStartGame.regY = _this._btnStartGame.image.height / 2;
                _this._btnStartGame.x = BubbleGunner.NormalWidth / 2;
                _this._btnStartGame.y = BubbleGunner.NormalHeight / 2 - 100;
                _this._btnStartGame.cursor = "pointer";
                setInterval(_this.pulse.bind(_this), 120);
                _this._btnStartGame.on("click", _this.changeToGameScene, _this);
                _this._btnStartHelp = new Bitmap(BubbleGunner.loader.getResult("menu-help"));
                _this._btnStartHelp.x = 50;
                _this._btnStartHelp.y = BubbleGunner.NormalHeight - _this._btnStartHelp.image.height - 50;
                _this._btnStartHelp.cursor = "pointer";
                _this._btnStartHelp.on("click", _this.dispatchStartHelpEvent, _this);
                _this.addChild(_this._btnStartGame);
                _this.addChild(_this._btnStartHelp);
                return _this;
            }
            MenuScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
            };
            MenuScene.prototype.changeToGameScene = function () {
                var _this = this;
                Tween.get(this)
                    .to({
                    alpha: 0,
                    scaleX: 10,
                    scaleY: 10
                }, 2 * 1000)
                    .call(function () {
                    _this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Game));
                });
            };
            MenuScene.prototype.dispatchStartHelpEvent = function () {
                this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Help));
            };
            MenuScene.prototype.pulse = function () {
                var newScale = this._btnStartGame.scaleX + 0.05;
                if (newScale >= 1.2)
                    newScale = 1;
                Tween.get(this._btnStartGame).to({
                    scaleX: newScale,
                    scaleY: newScale
                }, 110);
            };
            return MenuScene;
        }(BubbleGunner.Scene));
        Menu.MenuScene = MenuScene;
    })(Menu = BubbleGunner.Menu || (BubbleGunner.Menu = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=menu.js.map