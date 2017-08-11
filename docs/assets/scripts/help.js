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
    var Help;
    (function (Help) {
        var Bitmap = createjs.Bitmap;
        var HelpScene = (function (_super) {
            __extends(HelpScene, _super);
            function HelpScene() {
                var _this = _super.call(this) || this;
                var back = new Bitmap(BubbleGunner.loader.getResult("back"));
                back.x = 30;
                back.y = 30;
                back.on("click", _this.dispatchBackToMenuEvent, _this);
                back.cursor = "pointer";
                back.scaleX = back.scaleY = 1.5;
                _this.addChild(back);
                return _this;
            }
            HelpScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
            };
            HelpScene.prototype.dispatchBackToMenuEvent = function () {
                this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Menu));
            };
            return HelpScene;
        }(BubbleGunner.Scene));
        Help.HelpScene = HelpScene;
    })(Help = BubbleGunner.Help || (BubbleGunner.Help = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=help.js.map