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
var canvas;
var BubbleGunner;
(function (BubbleGunner) {
    var Shape = createjs.Shape;
    var Tween = createjs.Tween;
    var Container = createjs.Container;
    var Text = createjs.Text;
    var Bitmap = createjs.Bitmap;
    var Ease = createjs.Ease;
    var EventDispatcher = createjs.EventDispatcher;
    function isOfType(type) {
        return function (o) { return o instanceof type; };
    }
    BubbleGunner.isOfType = isOfType;
    function toType() {
        return function (o) { return o; };
    }
    BubbleGunner.toType = toType;
    function isCollidingWith(o) {
        return function (other) { return findDistance(new Point(o.x, o.y), new Point(other.x, other.y)) < 30; };
    }
    BubbleGunner.isCollidingWith = isCollidingWith;
    function hasCollisions(tuple) {
        return tuple[1].length > 0;
    }
    BubbleGunner.hasCollisions = hasCollisions;
    function findDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));
    }
    BubbleGunner.findDistance = findDistance;
    function getTweenDurationMSecs(p1, p2, speed) {
        if (speed === void 0) { speed = 200; }
        return Math.floor(findDistance(p1, p2) * 1000 / speed);
    }
    BubbleGunner.getTweenDurationMSecs = getTweenDurationMSecs;
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.toString = function () {
            return "(" + this.x + " , " + this.y + ")";
        };
        return Point;
    }());
    BubbleGunner.Point = Point;
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
            this.endPoint = point;
            return Tween.get(this)
                .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, getTweenDurationMSecs(this.startPoint, this.endPoint))
                .call(this.fallCallback.bind(this));
        };
        Animal.prototype.continueFall = function () {
            Tween.removeTweens(this);
            var newEndPoint = new Point(this.endPoint.x, canvas.height);
            return this.moveTo(newEndPoint);
        };
        Animal.prototype.fallCallback = function () {
            return Tween.get(this)
                .to({ alpha: .3 }, 300)
                .call(this.dispatchEvent.bind(this, Animal.EventFell));
        };
        Animal.EventFell = "fell";
        return Animal;
    }(Shape));
    var Lava = (function (_super) {
        __extends(Lava, _super);
        function Lava(startX) {
            var _this = _super.call(this) || this;
            _this.graphics
                .beginFill('red')
                .drawRect(0, 0, Lava.width, Lava.height);
            _this.startPoint = new Point(startX, 0);
            _this.x = _this.startPoint.x;
            _this.y = _this.startPoint.y;
            return _this;
        }
        Lava.prototype.moveTo = function (point) {
            var _this = this;
            this.endPoint = point;
            return Tween.get(this)
                .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, getTweenDurationMSecs(this.startPoint, this.endPoint, Lava.Speed))
                .call(function () { return _this.dispatchEvent(new Event(Lava.EventFell)); });
        };
        Lava.EventFell = "fell";
        Lava.Speed = 180;
        Lava.width = 12;
        Lava.height = 15;
        return Lava;
    }(Shape));
    var Bubble = (function (_super) {
        __extends(Bubble, _super);
        function Bubble(from, to) {
            var _this = _super.call(this) || this;
            _this.containsAnimal = false;
            _this._pulseCount = 0;
            _this.graphics
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .drawCircle(0, 0, Bubble.r);
            _this.on("tick", _this.pulse, _this);
            _this.startPoint = from;
            _this.x = _this.startPoint.x;
            _this.y = _this.startPoint.y;
            _this.endPoint = to;
            return _this;
        }
        Bubble.prototype.move = function () {
            this.updateEndPoint();
            return Tween.get(this)
                .to({
                x: this.endPoint.x,
                y: this.endPoint.y,
            }, getTweenDurationMSecs(this.startPoint, this.endPoint))
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventAscended)));
        };
        Bubble.prototype.takeAnimal = function (animal) {
            var _this = this;
            this._animal = animal;
            this.containsAnimal = true;
            this.graphics
                .clear()
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .drawCircle(0, 0, 15 + 5);
            this.x = this._animal.x;
            this.y = this._animal.y;
            Tween.removeTweens(this._animal);
            Tween.removeTweens(this);
            var targetY = -7;
            var duration = 3500;
            var tween = Tween.get(this)
                .to({ y: targetY }, duration)
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventRescuedAnimal)));
            tween.on("change", function () { return _this._animal.y = _this.y; }, this);
            return tween;
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
        Bubble.prototype.pop = function () {
            Tween.removeTweens(this);
            if (this.containsAnimal) {
                this._animal.continueFall();
            }
            return Tween.get(this)
                .to({
                alpha: 0
            }).call(this.dispatchEvent.bind(this, new Event(Bubble.EventPopped)));
        };
        Bubble.EventPopped = "popped";
        Bubble.EventAscended = "ascended";
        Bubble.EventRescuedAnimal = "rescued";
        Bubble.r = 15;
        return Bubble;
    }(Shape));
    var DragonHand = (function (_super) {
        __extends(DragonHand, _super);
        function DragonHand() {
            var _this = _super.call(this, "assets/images/dragon-hand.png") || this;
            _this.regX = 426;
            _this.regY = 110;
            return _this;
        }
        return DragonHand;
    }(Bitmap));
    var Dragon = (function (_super) {
        __extends(Dragon, _super);
        function Dragon() {
            var _this = _super.call(this) || this;
            _this._body = new Bitmap("assets/images/dragon.png");
            _this._hand = new Bitmap("assets/images/dragon-hand.png");
            _this._hand.regX = 426;
            _this._hand.regY = 110;
            _this._hand.x = 250;
            _this._hand.y = 180;
            _this.addChild(_this._body, _this._hand);
            return _this;
        }
        Dragon.prototype.shootBubbleTo = function (point) {
            this.aimGunToPoint(point);
            var bubble = new Bubble(this.getGunMuzzleStagePoint(), point);
            console.debug("Shooting bubble from: " + this.getGunMuzzleStagePoint());
            bubble.scaleX = bubble.scaleY = .1;
            Tween.get(bubble)
                .to({
                scaleX: 1,
                scaleY: 1,
            }, 150, Ease.bounceOut);
            return bubble;
        };
        Dragon.prototype.aimGun = function (evt) {
            this.aimGunToPoint(new Point(evt.stageX, evt.stageY));
        };
        Dragon.prototype.aimGunToPoint = function (targetPoint) {
            var handRegStagePoint = this.getHandRegStagePoint();
            if (handRegStagePoint.x < targetPoint.x) {
                this.scaleX = -Math.abs(this.scaleX);
            }
            else {
                this.scaleX = Math.abs(this.scaleX);
            }
            handRegStagePoint = this.getHandRegStagePoint();
            var yz = handRegStagePoint.y - targetPoint.y;
            var xz = handRegStagePoint.x - targetPoint.x;
            var angle;
            angle = Math.abs(Math.atan(yz / xz) / Math.PI * 180);
            this._hand.rotation = angle;
            // console.debug(`aiming at angle: ${angle}`);
        };
        Dragon.prototype.getHandRegStagePoint = function () {
            return new Point(this.x + this._hand.x * this.scaleX, this.y + this._hand.y * this.scaleY);
        };
        Dragon.prototype.getGunMuzzleStagePoint = function () {
            var p = new Point();
            var rotationRadians = Math.PI + this._hand.rotation * Math.PI / 180;
            if (this.scaleX < 0) {
                rotationRadians = 2 * Math.PI - rotationRadians;
            }
            var radius = 426 * this.scaleX;
            var center = this.getHandRegStagePoint();
            p.x = center.x + radius * Math.cos(rotationRadians);
            p.y = center.y + radius * Math.sin(rotationRadians);
            // console.debug(`Gun muzzle at: ${p}`);
            return p;
        };
        return Dragon;
    }(Container));
    var LevelManager = (function (_super) {
        __extends(LevelManager, _super);
        function LevelManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.currentLevel = 1;
            return _this;
        }
        LevelManager.prototype.getLevelMaxScore = function (level) {
            if (level == undefined) {
                level = this.currentLevel;
            }
            return LevelManager.Level1MaxScore * level;
        };
        LevelManager.prototype.setScore = function (score) {
            if (this.currentLevel < 3 && score > this.getLevelMaxScore()) {
                this.currentLevel++;
                this.dispatchEvent(new Event(LevelManager.EventLevelChanged));
            }
            // console.debug(`score => ${score}`);
            // console.debug(`level => ${this.currentLevel}`);
        };
        LevelManager.EventLevelChanged = "levelChanged";
        LevelManager.Level1MaxScore = 4;
        return LevelManager;
    }(EventDispatcher));
    var ScoresBar = (function (_super) {
        __extends(ScoresBar, _super);
        function ScoresBar(_levelManager, initialScore) {
            if (initialScore === void 0) { initialScore = 0; }
            var _this = _super.call(this) || this;
            _this._levelManager = _levelManager;
            _this._score = initialScore;
            var width = 200;
            var height = 30;
            _this._bar = new Shape();
            _this._bar.graphics
                .beginFill("yellow")
                .drawRect(0, 0, 2, 5);
            _this._bar.scaleX = 0;
            _this._bar.x = 0;
            _this._bar.y = 0;
            _this._scoreText = new Text(_this._score.toString(), undefined, 'white');
            _this._scoreText.x = width / 2;
            _this._scoreText.y = height + 10;
            _this.addChild(_this._bar, _this._scoreText);
            return _this;
        }
        ScoresBar.prototype.increaseScore = function () {
            this.setScore(this._score + 1);
        };
        ScoresBar.prototype.setScore = function (score) {
            this._score = score;
            this._levelManager.setScore(this._score);
            var levelCompletedPercent = this._score / this._levelManager.getLevelMaxScore() * 100;
            levelCompletedPercent = levelCompletedPercent >= 100 ? 100 : levelCompletedPercent;
            Tween.get(this._bar)
                .to({
                scaleX: levelCompletedPercent
            }, 300);
            this._scoreText.text = this._score.toString();
        };
        return ScoresBar;
    }(Container));
    var GameManager = (function () {
        function GameManager(_stage) {
            this._stage = _stage;
            this._levelManager = new LevelManager();
            this._animals = [];
            this._bubbles = [];
            this._lavas = [];
            this._isShapesLockFree = true;
            this._scoresBar = new ScoresBar(this._levelManager);
            this._scoresBar.x = 10;
            this._scoresBar.y = 10;
            this._dragon = new Dragon();
            this._dragon.scaleX = this._dragon.scaleY = .25;
            this._dragon.x = canvas.width / 2 - 25;
            this._dragon.y = canvas.height - 100;
        }
        GameManager.prototype.start = function () {
            setInterval(this.handleAnimalRainInterval.bind(this), 3000);
            setInterval(this.handleLavaRainInterval.bind(this), 4000);
            this._stage.addChild(this._scoresBar, this._dragon);
            this._stage.on("stagemousemove", this._dragon.aimGun, this._dragon);
            this._stage.on("stagemouseup", this.handleClick, this);
            this._stage.on("tick", this.tick, this);
        };
        GameManager.prototype.handleAnimalRainInterval = function () {
            var _this = this;
            var animal = new Animal(new Point(this.getRandomX(), 0));
            this.lockShapes(function () {
                _this._animals.push(animal);
            });
            this._stage.addChild(animal);
            console.debug(this._animals);
            animal.on(Animal.EventFell, function () { return _this.removeShape(animal); }, this);
            animal.moveTo(new Point(this.getRandomX(), this.getCanvasDimensions()[1]));
        };
        GameManager.prototype.handleLavaRainInterval = function () {
            var _this = this;
            var throwLava = function () {
                var lava = new Lava(_this.getRandomX());
                _this.lockShapes(function () { return _this._lavas.push(lava); });
                _this._stage.addChild(lava);
                console.debug(_this._lavas);
                lava.on(Lava.EventFell, function () { return _this.removeShape(lava); }, _this);
                lava.moveTo(new Point(_this.getRandomX(), _this.getCanvasDimensions()[1]));
            };
            // console.debug(`level: ${this._levelManager.currentLevel}`);
            switch (this._levelManager.currentLevel) {
                case 1:
                    // no lava
                    break;
                case 2:
                    throwLava();
                    break;
                case 3:
                    throwLava();
                    throwLava();
                    break;
                default:
                    throw "Invalid level: " + this._levelManager.currentLevel;
            }
        };
        GameManager.prototype.handleClick = function (evt) {
            var _this = this;
            var bubble = this._dragon.shootBubbleTo(new Point(evt.stageX, evt.stageY));
            this.lockShapes(function () {
                _this._bubbles.push(bubble);
            });
            this._stage.addChild(bubble);
            console.debug(this._bubbles);
            bubble.on(Bubble.EventPopped, function () { return _this.removeShape(bubble); }, this);
            bubble.on(Bubble.EventAscended, function () { return _this.removeShape(bubble); }, this);
            bubble.on(Bubble.EventRescuedAnimal, function () {
                _this._scoresBar.increaseScore();
                _this.removeShape(bubble.getAnimal(), bubble);
            }, this);
            bubble.move();
        };
        GameManager.prototype.removeShape = function () {
            var _this = this;
            var shapes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                shapes[_i] = arguments[_i];
            }
            this.lockShapes(function () {
                var _loop_1 = function (shape) {
                    _this._stage.removeChild(shape);
                    if (shape instanceof Bubble) {
                        _this._bubbles = _this._bubbles
                            .filter(function (b) { return b !== shape && b != undefined; });
                        console.debug(_this._bubbles);
                    }
                    else if (shape instanceof Animal) {
                        _this._animals = _this._animals
                            .filter(function (a) { return a !== shape && a != undefined; });
                        console.debug(_this._animals);
                    }
                    else if (shape instanceof Lava) {
                        _this._lavas = _this._lavas
                            .filter(function (l) { return l !== shape && l != undefined; });
                        console.debug(_this._lavas);
                    }
                    else {
                        console.warn("Unkown type to remove: " + shape);
                    }
                };
                for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
                    var shape = shapes_1[_i];
                    _loop_1(shape);
                }
            });
        };
        GameManager.prototype.tick = function () {
            var _this = this;
            if (!this._isShapesLockFree)
                return;
            this.lockShapes(function () {
                _this._bubbles
                    .filter(_this.isCollidingWithAnyLava(_this._lavas))
                    .forEach(function (b) { return b.pop(); });
                _this._bubbles
                    .filter(function (b) { return !b.containsAnimal; })
                    .map(function (b) { return [b, _this.findAnimalsCollidingWithBubble(b)]; })
                    .filter(hasCollisions)
                    .map(function (tuple) { return [tuple[0], tuple[1][0]]; })
                    .forEach(function (tuple) { return tuple[0].takeAnimal(tuple[1]); });
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
        GameManager.prototype.lockShapes = function (f) {
            this._isShapesLockFree = false;
            f();
            this._isShapesLockFree = true;
        };
        GameManager.prototype.findAnimalsCollidingWithBubble = function (bubble) {
            return this._animals.filter(isCollidingWith(bubble));
        };
        GameManager.prototype.isCollidingWithAnyLava = function (lavas) {
            return function (b) { return (lavas
                .filter(function (l) { return Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30; })
                .length > 0); };
        };
        GameManager.prototype.getCanvasDimensions = function () {
            return [canvas.width, canvas.height];
        };
        return GameManager;
    }());
    BubbleGunner.GameManager = GameManager;
})(BubbleGunner || (BubbleGunner = {}));
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function init() {
    canvas = document.getElementById("canvas");
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    var stage = new createjs.Stage(canvas);
    var manager = new BubbleGunner.GameManager(stage);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Touch.enable(stage);
    manager.start();
}
window.addEventListener("load", init);
//# sourceMappingURL=script.js.map