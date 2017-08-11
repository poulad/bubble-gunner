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
        var Sound = createjs.Sound;
        var SpriteSheet = createjs.SpriteSheet;
        var Sprite = createjs.Sprite;
        var MenuScene = (function (_super) {
            __extends(MenuScene, _super);
            function MenuScene() {
                var _this = _super.call(this) || this;
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
                _this._btnStartGame.y = BubbleGunner.NormalHeight / 2;
                _this._btnStartGame.cursor = "pointer";
                setInterval(_this.pulse.bind(_this), 120);
                _this._btnStartGame.on("click", _this.onStartButtonClick, _this);
                _this.addChild(_this._btnStartGame);
                _this._btnHelp = new Bitmap(BubbleGunner.loader.getResult("menu-help"));
                _this._btnHelp.x = BubbleGunner.NormalWidth - _this._btnHelp.image.width - 50;
                _this._btnHelp.y = 50;
                _this._btnHelp.cursor = "pointer";
                _this._btnHelp.on("click", _this.onHelpButtonClick, _this);
                _this.addChild(_this._btnHelp);
                var data = {
                    images: [BubbleGunner.loader.getResult("menu-dragon")],
                    frames: [
                        // Cheer
                        [0, 0, 552, 674],
                        [552, 0, 552, 674],
                        [0, 0, 552, 674],
                        // Run
                        [0, 674, 552, 674],
                        [552, 674, 552, 674]
                    ],
                    framerate: 4,
                    animations: {
                        cheer: [0, 2, "run"],
                        runCheer: [3, 4, "cheer"],
                        run: [3, 4],
                    }
                };
                _this._dragon = new Sprite(new SpriteSheet(data));
                _this._dragon.regX = 226;
                _this._dragon.regY = 337;
                var n = 9;
                _this._dragon.x = (n - 3) * BubbleGunner.NormalWidth / n;
                _this._dragon.y = BubbleGunner.NormalHeight - 190;
                _this._dragon.scaleX = _this._dragon.scaleY = .4;
                _this.addChild(_this._dragon);
                return _this;
            }
            MenuScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this._dragon.on("animationend", this.moveDragon, this);
                this._dragon.gotoAndPlay("run");
                this.moveDragon(undefined);
            };
            MenuScene.prototype.onStartButtonClick = function () {
                var _this = this;
                Sound.play("sound-button");
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
            MenuScene.prototype.onHelpButtonClick = function () {
                Sound.play("sound-button");
                this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Help));
            };
            MenuScene.prototype.moveDragon = function (evt) {
                var _this = this;
                if (evt && evt.name !== "cheer")
                    return;
                console.debug("Dragon running to other side");
                var n = 9;
                var newX = this._dragon.scaleX > 0 ? 3 * BubbleGunner.NormalWidth / n : (n - 3) * BubbleGunner.NormalWidth / n;
                Tween.get(this._dragon).to({
                    x: newX
                }, 2.5 * 1000)
                    .call(function () {
                    _this._dragon.gotoAndPlay("cheer");
                    _this._dragon.scaleX *= -1;
                });
            };
            MenuScene.prototype.pulse = function () {
                var newScale = this._btnStartGame.scaleX + 0.05;
                if (newScale >= 1.2)
                    newScale = 1;
                Tween.get(this._btnStartGame).to({
                    scaleX: newScale,
                    scaleY: newScale
                }, 110);
                var newAlpha = this._btnHelp.alpha - .08;
                if (newAlpha < .9)
                    newAlpha = 1;
                Tween.get(this._btnHelp).to({ alpha: newAlpha }, 110);
            };
            return MenuScene;
        }(BubbleGunner.Scene));
        Menu.MenuScene = MenuScene;
    })(Menu = BubbleGunner.Menu || (BubbleGunner.Menu = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=menu.js.map