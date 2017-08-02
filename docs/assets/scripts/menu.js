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
        var MenuScene = (function (_super) {
            __extends(MenuScene, _super);
            function MenuScene() {
                var _this = _super.call(this) || this;
                _this._btnStartGame = new Shape();
                _this._btnStartGame.graphics
                    .beginStroke("yellow")
                    .beginFill("#eee")
                    .drawRect(0, 0, 120, 80);
                _this._btnStartGame.x = 360;
                _this._btnStartGame.y = 100;
                var startGameText = new Text("Start Shooting Bubbles", "Sans 15pt", "red");
                startGameText.x = 370;
                startGameText.y = 120;
                _this._btnStartGame.cursor = "pointer";
                _this._btnStartGame.on("click", _this.dispatchStartGameEvent, _this);
                _this.addChild(_this._btnStartGame, startGameText);
                return _this;
            }
            MenuScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
            };
            MenuScene.prototype.dispatchStartGameEvent = function () {
                this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Game));
            };
            return MenuScene;
        }(BubbleGunner.Scene));
        Menu.MenuScene = MenuScene;
    })(Menu = BubbleGunner.Menu || (BubbleGunner.Menu = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=menu.js.map