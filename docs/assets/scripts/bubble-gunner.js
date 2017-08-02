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
    var Ticker = createjs.Ticker;
    var Touch = createjs.Touch;
    var EventDispatcher = createjs.EventDispatcher;
    var MenuScene = BubbleGunner.Menu.MenuScene;
    var GameScene = BubbleGunner.Game.GameScene;
    var PreloadScene = BubbleGunner.Menu.PreloadScene;
    var GameManager = (function (_super) {
        __extends(GameManager, _super);
        function GameManager(_stage) {
            var _this = _super.call(this) || this;
            _this._stage = _stage;
            return _this;
        }
        GameManager.prototype.startGame = function () {
            Ticker.framerate = 60;
            Ticker.addEventListener("tick", this._stage);
            Touch.enable(this._stage);
            this._stage.enableMouseOver(10);
            this.startNewScene(BubbleGunner.SceneType.Preload);
        };
        GameManager.prototype.startNewScene = function (sceneType) {
            var sceneArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sceneArgs[_i - 1] = arguments[_i];
            }
            this._stage.removeAllChildren();
            this._currentScene = GameManager.createScene(sceneType);
            this._stage.addChild(this._currentScene);
            this._currentScene.on(BubbleGunner.Scene.EventChangeScene, this.changeSceneHandler, this);
            this._currentScene.start();
        };
        GameManager.prototype.changeSceneHandler = function (evt) {
            this.startNewScene(evt.toScene, evt.startArgs);
        };
        GameManager.createScene = function (sceneType) {
            var scene;
            switch (sceneType) {
                case BubbleGunner.SceneType.Preload:
                    scene = new PreloadScene();
                    break;
                case BubbleGunner.SceneType.Menu:
                    scene = new MenuScene();
                    break;
                case BubbleGunner.SceneType.Game:
                    scene = new GameScene();
                    break;
                default:
                    throw new Error("Scene type " + sceneType + " not implemented yet");
            }
            return scene;
        };
        return GameManager;
    }(EventDispatcher));
    BubbleGunner.GameManager = GameManager;
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=bubble-gunner.js.map