var Shape = createjs.Shape;
var DisplayObject = createjs.DisplayObject;
var Stage = createjs.Stage;
var Ticker = createjs.Ticker;
var Tween = createjs.Tween;
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Animal = (function () {
    function Animal(point) {
        var r = 15;
        this._shape = new Shape();
        this._shape.graphics
            .beginFill('lime')
            .drawCircle(0, 0, r);
        console.info(this._shape.regY);
        this._shape.x = point.x;
        this._shape.y = point.y;
        this.startPoint = point;
        this._shape.regY = r;
    }
    Animal.prototype.moveTo = function (point) {
        this.endPoint = point;
        Tween.get(this._shape)
            .to({
            x: point.x,
            y: point.y,
        }, 7000);
    };
    Animal.prototype.getShape = function () {
        return this._shape;
    };
    return Animal;
}());
var Bubble = (function () {
    function Bubble(targetPoint) {
        var r = 15;
        this._shape = new Shape();
        this._shape.graphics
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, r);
        this._shape.regY = r;
        var initPoint = new Point(canvas.width / 2, canvas.height - 20);
        this._shape.x = initPoint.x;
        this._shape.y = initPoint.y;
        this.startPoint = initPoint;
        this.endPoint = targetPoint;
    }
    Bubble.prototype.move = function () {
        this.updateEndPoint();
        Tween.get(this._shape)
            .to({
            x: this.endPoint.x,
            y: this.endPoint.y,
        }, 4000);
    };
    Bubble.prototype.getShape = function () {
        return this._shape;
    };
    Bubble.prototype.updateEndPoint = function () {
        /*
        line equation:
        y = mx + b
        m = (y2 - y1) / (x2 - x1)
        */
        var m = (this.endPoint.y - this.startPoint.y) / (this.endPoint.x - this.startPoint.x);
        var b = this.startPoint.y - m * this.startPoint.x;
        this.endPoint.y = 0;
        this.endPoint.x = -(b / m);
    };
    return Bubble;
}());
var GameManager = (function () {
    function GameManager(_stage) {
        this._stage = _stage;
        this._animals = [];
    }
    GameManager.prototype.start = function () {
        var _this = this;
        var intervalAnimal = setInterval(function () {
            var a = new Animal(new Point(_this.getRandomX(), 0));
            var s = a.getShape();
            _this._stage.addChild(s);
            a.moveTo(new Point(_this.getRandomX(), canvas.width));
        }, 3000);
    };
    GameManager.prototype.getRandomX = function () {
        var x;
        x = (Math.random() * 324627938) % canvas.width;
        return x;
    };
    GameManager.prototype.getRandomY = function () {
        var y;
        y = (Math.random() * 876372147) % canvas.height;
        return y;
    };
    return GameManager;
}());
var canvas;
var stage;
function handleClick(evt) {
    var bubble = new Bubble(new Point(evt.x, evt.y));
    stage.addChild(bubble.getShape());
    bubble.move();
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
    var manager = new GameManager(stage);
    Ticker.addEventListener("tick", stage);
    createjs.Touch.enable(stage);
    manager.start();
    canvas.addEventListener("click", handleClick, false);
}
window.addEventListener("load", init);
//# sourceMappingURL=script.js.map