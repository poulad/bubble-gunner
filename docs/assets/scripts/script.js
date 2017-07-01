var Script;
(function (Script) {
    var Stage = createjs.Stage;
    var Shape = createjs.Shape;
    var Ticker = createjs.Ticker;
    var Tween = createjs.Tween;
    var Ease = createjs.Ease;
    var Touch = createjs.Touch;
    var canvas;
    var stage;
    var bg;
    var circle;
    function beginMoveCircle(ev) {
        function setBgToDark() {
            bg.graphics
                .clear()
                .beginFill("#555")
                .drawRect(0, 0, canvas.width, canvas.height);
        }
        bg.graphics
            .clear()
            .beginFill("#458")
            .drawRect(0, 0, canvas.width, canvas.height);
        Tween.get(circle)
            .to({
            x: ev.stageX,
            y: ev.stageY
        }, undefined, Ease.backInOut)
            .call(setBgToDark);
    }
    function draw() {
        bg = new Shape();
        bg.graphics
            .beginFill('#555')
            .drawRect(0, 0, canvas.width, canvas.height);
        stage.addChild(bg);
        circle = new Shape();
        circle.graphics
            .beginFill("red")
            .beginStroke('yellow')
            .drawCircle(0, 0, 20);
        circle.x = canvas.width / 2;
        circle.y = canvas.height / 2;
        stage.addChild(circle);
        circle.addEventListener("pressmove", beginMoveCircle);
    }
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    function init() {
        canvas = document.getElementById("canvas");
        window.addEventListener("resize", resizeCanvas, false);
        resizeCanvas();
        stage = new Stage(canvas);
        Touch.enable(stage);
        Ticker.framerate = 60;
        Ticker.addEventListener("tick", function () { return stage.update(); });
        draw();
    }
    Script.init = init;
})(Script || (Script = {}));
window.addEventListener("load", Script.init);
//# sourceMappingURL=script.js.map