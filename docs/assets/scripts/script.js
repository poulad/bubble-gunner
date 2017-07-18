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
var Shape = createjs.Shape;
var DisplayObject = createjs.DisplayObject;
var Stage = createjs.Stage;
var Ticker = createjs.Ticker;
var Tween = createjs.Tween;
var canvas;
function addToArray(array, item) {
    var i = 0;
    for (; i < array.length; i++) {
        if (array[i] === null) {
            break;
        }
    }
    array[i] = item;
    return i;
}
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Animal = (function (_super) {
    __extends(Animal, _super);
    function Animal(point) {
        var _this = _super.call(this) || this;
        var r = 15;
        _this.graphics
            .beginFill('lime')
            .drawCircle(0, 0, r);
        _this.x = point.x;
        _this.y = point.y;
        _this.startPoint = point;
        return _this;
    }
    Animal.prototype.moveTo = function (point) {
        var _this = this;
        this.endPoint = point;
        var t = Tween.get(this)
            .to({
            x: point.x,
            y: point.y,
        }, 7000)
            .call(function () {
            Tween.get(_this)
                .to({ alpha: 0 }, 300);
        });
        return t;
    };
    return Animal;
}(Shape));
var Bubble = (function (_super) {
    __extends(Bubble, _super);
    function Bubble(targetPoint) {
        var _this = _super.call(this) || this;
        _this.containsAnimal = false;
        _this._pulseEventListener = _this.pulse.bind(_this);
        _this._pulseCount = 0;
        _this.graphics
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, Bubble.r);
        _this.addEventListener("tick", _this._pulseEventListener);
        var initPoint = new Point(canvas.width / 2, canvas.height - 20);
        _this.x = initPoint.x;
        _this.y = initPoint.y;
        _this.startPoint = initPoint;
        _this.endPoint = targetPoint;
        return _this;
    }
    Bubble.prototype.move = function () {
        this.updateEndPoint();
        var tween;
        tween = Tween.get(this)
            .to({
            x: this.endPoint.x,
            y: this.endPoint.y,
        }, 4000);
        return tween;
    };
    Bubble.prototype.setAnimal = function (animal) {
        this._animal = animal;
        this.containsAnimal = this._animal != undefined;
    };
    Bubble.prototype.getAnimal = function () {
        return this._animal;
    };
    Bubble.prototype.pulse = function () {
        var alpha = Math.cos(this._pulseCount++ * 0.1) * 0.4 + 0.6;
        Tween.get(this)
            .to({
            alpha: alpha
        }, 100);
        this._pulseCount++;
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
    Bubble.r = 15;
    return Bubble;
}(Shape));
var GameManager = (function () {
    function GameManager(_stage) {
        this._stage = _stage;
        this._animals = [];
        this._bubbles = [];
        this._stageTickEventListener = this.tick.bind(this);
        this._stageClickEventListener = this.handleClick.bind(this);
        this._isReadyToHandleTick = true;
    }
    GameManager.prototype.start = function () {
        var intervalAnimal = setInterval(this.handleInterval.bind(this), 3000);
        this._stage.addEventListener("stagemouseup", this._stageClickEventListener, false);
        this._stage.addEventListener("tick", this._stageTickEventListener);
    };
    GameManager.prototype.handleInterval = function () {
        var animal = new Animal(new Point(this.getRandomX(), 0));
        var index = addToArray(this._animals, animal);
        this._stage.addChild(animal);
        console.debug(this._animals);
        animal.moveTo(new Point(this.getRandomX(), canvas.width))
            .call(this.removeShape.bind(this, animal, index));
    };
    GameManager.prototype.handleClick = function (evt) {
        var bubble = new Bubble(new Point(evt.stageX, evt.stageY));
        var index = addToArray(this._bubbles, bubble);
        this._stage.addChild(bubble);
        console.debug(this._bubbles);
        bubble.move()
            .call(this.removeShape.bind(this, bubble, index));
    };
    GameManager.prototype.removeShape = function (shape, index) {
        if (index === void 0) { index = undefined; }
        this._stage.removeChild(shape);
        if (index === undefined)
            return;
        if (shape instanceof Bubble) {
            this._bubbles[index] = null;
        }
        else if (shape instanceof Animal) {
            this._animals[index] = null;
        }
    };
    GameManager.prototype.tick = function () {
        if (!this._isReadyToHandleTick)
            return;
        this._isReadyToHandleTick = false;
        for (var i = 0; i < this._bubbles.length; i++) {
            if (this._bubbles[i] == undefined)
                continue;
            var b = this._bubbles[i];
            for (var j = 0; j < this._animals.length; j++) {
                if (this._animals[j] == undefined)
                    continue;
                var a = this._animals[j];
                try {
                    var distance = Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
                    if (distance <= 30 && !b.containsAnimal) {
                        this.wrapAnimalInBubble(b, a);
                        // this._stage.removeChild(a, b);
                        // b = a = null;
                    }
                }
                catch (exc) {
                    console.info(exc.message);
                }
            }
        }
        this._isReadyToHandleTick = true;
        return;
    };
    GameManager.prototype.wrapAnimalInBubble = function (bubble, animal) {
        var _this = this;
        bubble.setAnimal(animal);
        bubble.graphics
            .clear()
            .beginFill('rgba(255, 255, 255, .1)')
            .beginStroke('rgba(255, 255, 255, .8)')
            .drawCircle(0, 0, 15 + 5);
        bubble.x = animal.x;
        bubble.y = animal.y;
        Tween.removeTweens(bubble);
        Tween.removeTweens(animal);
        var time = 3500;
        var y = -25;
        Tween.get(animal)
            .to({
            y: y
        }, time);
        Tween.get(bubble)
            .to({
            y: y
        }, time)
            .call(function () {
            _this._stage.removeChild(bubble, animal);
            _this._isReadyToHandleTick = false;
            var i;
            i = _this._animals.indexOf(animal);
            if (i > -1)
                _this._animals[i] = null;
            i = _this._bubbles.indexOf(bubble);
            if (i > -1)
                _this._bubbles[i] = null;
            _this._isReadyToHandleTick = true;
        });
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
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function init() {
    canvas = document.getElementById("canvas");
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    var stage = new Stage(canvas);
    var manager = new GameManager(stage);
    Ticker.addEventListener("tick", stage);
    createjs.Touch.enable(stage);
    manager.start();
}
window.addEventListener("load", init);
//# sourceMappingURL=script.js.map