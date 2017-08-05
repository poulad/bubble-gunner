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
    var Container = createjs.Container;
    var Event = createjs.Event;
    BubbleGunner.NormalWidth = 800;
    BubbleGunner.NormalHeight = 600;
    var SceneEvent = (function (_super) {
        __extends(SceneEvent, _super);
        function SceneEvent(type, toScene) {
            var startArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                startArgs[_i - 2] = arguments[_i];
            }
            var _this = _super.call(this, type, undefined, undefined) || this;
            _this.toScene = toScene;
            _this.startArgs = startArgs;
            return _this;
        }
        return SceneEvent;
    }(Event));
    BubbleGunner.SceneEvent = SceneEvent;
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Scene.EventChangeScene = "changeScene";
        return Scene;
    }(Container));
    BubbleGunner.Scene = Scene;
    var SceneType;
    (function (SceneType) {
        SceneType[SceneType["Preload"] = 0] = "Preload";
        SceneType[SceneType["Menu"] = 1] = "Menu";
        SceneType[SceneType["Help"] = 2] = "Help";
        SceneType[SceneType["Game"] = 3] = "Game";
        SceneType[SceneType["GameOver"] = 4] = "GameOver";
    })(SceneType = BubbleGunner.SceneType || (BubbleGunner.SceneType = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=bubble-gunner2.js.map