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
    var Game;
    (function (Game) {
        var Shape = createjs.Shape;
        var Tween = createjs.Tween;
        var Container = createjs.Container;
        var Text = createjs.Text;
        var Bitmap = createjs.Bitmap;
        var Ease = createjs.Ease;
        var EventDispatcher = createjs.EventDispatcher;
        var Sound = createjs.Sound;
        function hasCollisions(tuple) {
            return tuple[1].length > 0;
        }
        Game.hasCollisions = hasCollisions;
        function findDistance(p1, p2) {
            return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));
        }
        Game.findDistance = findDistance;
        function getTweenDurationMSecs(p1, p2, speed) {
            if (speed === void 0) { speed = 180; }
            return Math.floor(findDistance(p1, p2) * 1000 / speed);
        }
        Game.getTweenDurationMSecs = getTweenDurationMSecs;
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
        Game.Point = Point;
        var Animal = (function (_super) {
            __extends(Animal, _super);
            function Animal(point) {
                var _this = _super.call(this) || this;
                _this.graphics
                    .beginFill('lime')
                    .drawCircle(0, 0, Animal.Radius);
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
                var newEndPoint = new Point(this.endPoint.x, BubbleGunner.NormalHeight);
                return this.moveTo(newEndPoint);
            };
            Animal.prototype.fallCallback = function () {
                return Tween.get(this)
                    .to({ alpha: .3 }, 300)
                    .call(this.dispatchEvent.bind(this, Animal.EventFell));
            };
            Animal.EventFell = "fell";
            Animal.Radius = 22;
            return Animal;
        }(Shape));
        var Lava = (function (_super) {
            __extends(Lava, _super);
            function Lava(startX) {
                var _this = _super.call(this) || this;
                _this.graphics
                    .beginFill('red')
                    .drawRect(0, 0, Lava.Width, Lava.Height);
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
            Lava.Speed = 400;
            Lava.Width = 25;
            Lava.Height = 20;
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
                    .drawCircle(0, 0, Bubble.Radius);
                _this.startPoint = from;
                _this.x = _this.startPoint.x;
                _this.y = _this.startPoint.y;
                _this.endPoint = to;
                return _this;
            }
            Bubble.prototype.move = function () {
                this.on("tick", this.handleTick, this);
                this.updateEndPoint();
                return Tween.get(this)
                    .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Bubble.Speed))
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
                    .drawCircle(0, 0, Bubble.Radius);
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
            Bubble.prototype.handleTick = function () {
                if (this.x < (0 - Bubble.Radius * this.scaleX) ||
                    (BubbleGunner.NormalWidth + Bubble.Radius * this.scaleX) < this.x) {
                    // Bubble is out of the visual horizon of canvas
                    this.dispatchEvent(new Event(Bubble.EventAscended));
                }
                this.pulse();
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
                var finalY = 0; // Bubble goes up
                if (this.endPoint.y >= this.startPoint.y)
                    finalY = BubbleGunner.NormalHeight; // Bubble goes down
                var m = (this.startPoint.y - this.endPoint.y) / (this.startPoint.x - this.endPoint.x);
                var b = this.endPoint.y - m * this.endPoint.x;
                this.endPoint.y = finalY;
                this.endPoint.x = (this.endPoint.y - b) / m;
            };
            Bubble.EventPopped = "popped";
            Bubble.EventAscended = "ascended";
            Bubble.EventRescuedAnimal = "rescued";
            Bubble.Radius = 28;
            Bubble.Speed = 450;
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
                _this.originalWidth = 140;
                _this.originalHeight = 408;
                _this._canShoot = true;
                _this._body = new Bitmap(BubbleGunner.loader.getResult("dragon"));
                _this._hand = new Bitmap(BubbleGunner.loader.getResult("dragon-hand"));
                _this._hand.regX = 426;
                _this._hand.regY = 110;
                _this._hand.x = 250;
                _this._hand.y = 180;
                _this.addChild(_this._body, _this._hand);
                return _this;
            }
            Dragon.prototype.shootBubbleTo = function (point) {
                var _this = this;
                if (!this._canShoot)
                    return;
                this.aimGunToPoint(point);
                var gunMuzzlePoint = this.getGunMuzzleStagePoint();
                var bubble = new Bubble(gunMuzzlePoint, point);
                console.debug("Shooting bubble from: " + gunMuzzlePoint);
                var targetScale = bubble.scaleX;
                bubble.scaleX = bubble.scaleY = .1;
                Tween.get(bubble)
                    .to({
                    scaleX: targetScale,
                    scaleY: targetScale,
                }, 150, Ease.bounceOut);
                this._canShoot = false;
                setTimeout(function () {
                    if (_this)
                        _this._canShoot = true;
                }, Dragon.FireRate);
                return bubble;
            };
            Dragon.prototype.aimGun = function (evt) {
                var stage = evt.target;
                var stagePoint = new Point(evt.stageX / stage.scaleX, evt.stageY / stage.scaleY);
                // console.debug(`Mouse on stage point: ${stagePoint}`);
                this.aimGunToPoint(stagePoint);
            };
            Dragon.prototype.isReadyToShoot = function () {
                return this._canShoot;
            };
            Dragon.prototype.aimGunToPoint = function (targetPoint) {
                var minAngle = -10;
                var handRegStagePoint = this.getHandRegStagePoint();
                if (handRegStagePoint.x < targetPoint.x) {
                    this.scaleX = -Math.abs(this.scaleX);
                }
                else {
                    this.scaleX = Math.abs(this.scaleX);
                }
                handRegStagePoint = this.getHandRegStagePoint();
                var yDiff = targetPoint.y - handRegStagePoint.y;
                var xDiff = targetPoint.x - handRegStagePoint.x;
                var angle = Math.atan(yDiff / xDiff) / Math.PI * 180;
                if (this.scaleX < 0)
                    angle *= -1;
                if (angle < minAngle)
                    angle = minAngle;
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
            Dragon.FireRate = 300;
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
            function ScoresBar(_levelManager, _score, _remainingLives) {
                if (_score === void 0) { _score = 0; }
                if (_remainingLives === void 0) { _remainingLives = 4; }
                var _this = _super.call(this) || this;
                _this._levelManager = _levelManager;
                _this._score = _score;
                _this._remainingLives = _remainingLives;
                _this._hearts = [];
                var barMargin = 3;
                _this._mask = new Bitmap(BubbleGunner.loader.getResult("scoresbar"));
                _this.addChild(_this._mask);
                _this.setChildIndex(_this._mask, 2);
                _this._bar = new Shape();
                _this._bar.graphics
                    .beginFill("yellow")
                    .drawRect(0, 0, .72, _this._mask.getBounds().height - barMargin * 2);
                _this._bar.scaleX = 0;
                _this._bar.x = barMargin;
                _this._bar.y = barMargin;
                _this.addChild(_this._bar);
                _this.setChildIndex(_this._bar, 1);
                _this._scoreText = new Text(_this._score.toString(), "20px Arial", 'white');
                _this._scoreText.x = _this._mask.getBounds().width + 10;
                _this._scoreText.y = 0;
                _this.addChild(_this._scoreText);
                _this.setChildIndex(_this._scoreText, 1);
                for (var i = 0; i < _remainingLives; i++) {
                    var heart = new Bitmap(BubbleGunner.loader.getResult("heart"));
                    heart.scaleX = heart.scaleY = .3;
                    heart.x = i * 20;
                    heart.y = _this._mask.getBounds().height + 8;
                    _this._hearts.push(heart);
                    _this.addChild(heart);
                }
                return _this;
            }
            ScoresBar.prototype.increaseScore = function () {
                this.setScore(this._score + 1);
            };
            ScoresBar.prototype.decreaseRemainingLives = function () {
                this.setRemainingLives(this._remainingLives - 1);
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
            ScoresBar.prototype.getScore = function () {
                return this._score;
            };
            ScoresBar.prototype.setRemainingLives = function (n) {
                var _this = this;
                this._remainingLives = n;
                this._hearts
                    .filter(function (heart, index) { return (index + 1) > n; })
                    .forEach(function (heart) {
                    Tween.get(heart)
                        .to({ alpha: 0, x: -50 }, 300)
                        .call(function () {
                        _this.removeChild(heart);
                        _this._hearts.pop();
                        console.debug("Hearts left: " + _this._hearts.length);
                        if (_this._hearts.length <= 0) {
                            _this.dispatchEvent(new Event(ScoresBar.EventNoLifeLeft));
                        }
                    });
                });
            };
            ScoresBar.prototype.getRemainingLives = function () {
                return this._remainingLives;
            };
            ScoresBar.EventNoLifeLeft = "noLifeLeft";
            return ScoresBar;
        }(Container));
        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            function GameScene() {
                var _this = _super.call(this) || this;
                _this._levelManager = new LevelManager();
                _this._animals = [];
                _this._bubbles = [];
                _this._lavas = [];
                _this._isShapesLockFree = true;
                var bgColor = new Shape();
                bgColor.graphics
                    .beginFill("#222")
                    .drawRect(0, 0, BubbleGunner.NormalWidth, BubbleGunner.NormalHeight);
                bgColor.x = bgColor.y = 0;
                _this.addChild(bgColor);
                var volcano = new Bitmap(BubbleGunner.loader.getResult("volcano"));
                _this.addChild(volcano);
                _this._scoresBar = new ScoresBar(_this._levelManager);
                _this._scoresBar.x = 10;
                _this._scoresBar.y = 10;
                _this._scoresBarListener = _this._scoresBar.on(ScoresBar.EventNoLifeLeft, _this.changeGameScene.bind(_this, BubbleGunner.SceneType.GameOver));
                _this.addChild(_this._scoresBar);
                _this.setChildIndex(_this._scoresBar, 3);
                _this._dragon = new Dragon();
                _this._dragon.scaleX = _this._dragon.scaleY = .3;
                _this._dragon.x = BubbleGunner.NormalWidth / 2;
                _this._dragon.y = BubbleGunner.NormalHeight - _this._dragon.originalHeight * _this._dragon.scaleY - 40;
                _this.addChild(_this._dragon);
                _this.setChildIndex(_this._dragon, 3);
                _this._pauseButton = new Bitmap(BubbleGunner.loader.getResult("pause"));
                _this._pauseButton.x = 30;
                _this._pauseButton.y = BubbleGunner.NormalHeight - _this._pauseButton.getBounds().height - 30;
                _this._pauseButton.cursor = "pointer";
                _this._pauseButtonListener = _this._pauseButton.on("click", _this.changeGameScene.bind(_this, BubbleGunner.SceneType.Menu));
                _this.addChild(_this._pauseButton);
                _this.setChildIndex(_this._pauseButton, 3);
                _this._tickListener = _this.on("tick", _this.handleTick, _this);
                return _this;
            }
            GameScene.prototype.start = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this._animalRainInterval = setInterval(this.handleAnimalRainInterval.bind(this), 3000);
                this._lavaRainInterval = setInterval(this.handleLavaRainInterval.bind(this), 4000);
                this._mouseMoveListener = this.stage.on("stagemousemove", this._dragon.aimGun, this._dragon);
                this._mouseUpListener = this.stage.on("stagemouseup", this.handleClick, this);
                this.playBackgroundMusic();
            };
            GameScene.prototype.changeGameScene = function (toScene) {
                this.off("tick", this._tickListener);
                this.stage.off("stagemousemove", this._mouseMoveListener);
                this.stage.off("stagemouseup", this._mouseUpListener);
                this._scoresBar.off(ScoresBar.EventNoLifeLeft, this._scoresBarListener);
                this._bgMusic.off("complete", this._bgMusicListener);
                this._pauseButton.off("click", this._pauseButtonListener);
                clearInterval(this._animalRainInterval);
                clearInterval(this._lavaRainInterval);
                this._bgMusic.stop();
                this.removeAllChildren();
                this._bubbles.length = this._animals.length = this._lavas.length = 0;
                // ToDo: Clear up all events handlers, and etc
                switch (toScene) {
                    case BubbleGunner.SceneType.Menu:
                        this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.Menu));
                        break;
                    case BubbleGunner.SceneType.GameOver:
                        this.dispatchEvent(new BubbleGunner.SceneEvent(BubbleGunner.Scene.EventChangeScene, BubbleGunner.SceneType.GameOver));
                        break;
                    default:
                        throw new Error("Invalid scene type: " + toScene);
                }
            };
            GameScene.prototype.handleAnimalRainInterval = function () {
                var _this = this;
                var animal = new Animal(new Point(GameScene.getRandomX(), 0));
                this.lockShapes(function () {
                    _this._animals.push(animal);
                });
                this.addChild(animal);
                this.setChildIndex(animal, 2);
                console.debug(this._animals);
                animal.on(Animal.EventFell, this.handleAnimalFall, this);
                animal.moveTo(new Point(GameScene.getRandomX(), BubbleGunner.NormalHeight));
            };
            GameScene.prototype.handleLavaRainInterval = function () {
                var _this = this;
                var throwLava = function () {
                    var lava = new Lava(GameScene.getRandomX());
                    _this.lockShapes(function () { return _this._lavas.push(lava); });
                    _this.addChild(lava);
                    _this.setChildIndex(lava, 2);
                    console.debug(_this._lavas);
                    lava.on(Lava.EventFell, function () { return _this.removeShape(lava); }, _this);
                    lava.moveTo(new Point(GameScene.getRandomX(), BubbleGunner.NormalHeight));
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
                        setTimeout(throwLava, 900);
                        break;
                    default:
                        throw "Invalid level: " + this._levelManager.currentLevel;
                }
            };
            GameScene.prototype.handleClick = function (evt) {
                var _this = this;
                if (!this._dragon.isReadyToShoot())
                    return;
                var stagePoint = new Point(evt.stageX / this.stage.scaleX, evt.stageY / this.stage.scaleY);
                var bubble = this._dragon.shootBubbleTo(stagePoint);
                this.lockShapes(function () {
                    _this._bubbles.push(bubble);
                });
                this.addChild(bubble);
                this.setChildIndex(bubble, 2);
                console.debug(this._bubbles);
                bubble.on(Bubble.EventPopped, function () { return _this.removeShape(bubble); }, this);
                bubble.on(Bubble.EventAscended, function () { return _this.removeShape(bubble); }, this);
                bubble.on(Bubble.EventRescuedAnimal, function () {
                    _this._scoresBar.increaseScore();
                    _this.removeShape(bubble.getAnimal(), bubble);
                }, this);
                bubble.move();
            };
            GameScene.prototype.playBackgroundMusic = function () {
                this._bgMusic = Sound.play("bgm");
                this._bgMusicListener = this._bgMusic.on("complete", this.playBackgroundMusic, this);
                this._bgMusic.volume = 100;
                this._bgMusic.pan = .5;
            };
            GameScene.prototype.handleAnimalFall = function (evt) {
                var animal = evt.target;
                this._scoresBar.decreaseRemainingLives();
                this.removeShape(animal);
            };
            GameScene.prototype.removeShape = function () {
                var _this = this;
                var shapes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    shapes[_i] = arguments[_i];
                }
                this.lockShapes(function () {
                    var _loop_1 = function (shape) {
                        _this.removeChild(shape);
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
                            console.warn("Unknown type to remove: " + shape);
                        }
                    };
                    for (var _i = 0, shapes_1 = shapes; _i < shapes_1.length; _i++) {
                        var shape = shapes_1[_i];
                        _loop_1(shape);
                    }
                });
            };
            GameScene.prototype.handleTick = function () {
                var _this = this;
                if (!this._isShapesLockFree)
                    return;
                this.lockShapes(function () {
                    _this._bubbles
                        .filter(_this.isCollidingWithAnyLava(_this._lavas))
                        .forEach(function (b) { return b.pop(); });
                    _this._bubbles
                        .filter(_this.isNotCollidingWithOtherBubbles(_this._bubbles))
                        .map(function (b) { return [b, _this.findAnimalsCollidingWithBubble(b, _this._animals)]; })
                        .filter(hasCollisions)
                        .map(function (tuple) { return [tuple[0], tuple[1][0]]; })
                        .forEach(function (tuple) { return tuple[0].takeAnimal(tuple[1]); });
                });
            };
            GameScene.getRandomX = function () {
                var x;
                x = (Math.random() * 324627938) % BubbleGunner.NormalWidth;
                return x;
            };
            GameScene.prototype.lockShapes = function (f) {
                this._isShapesLockFree = false;
                f();
                this._isShapesLockFree = true;
            };
            GameScene.prototype.isNotCollidingWithOtherBubbles = function (allBubbles) {
                var centersDistance = Bubble.Radius * 2;
                return function (bubble) {
                    var circle1Center = new Point(bubble.x, bubble.y);
                    var isCollidingWithBubble = function (b) {
                        var circle2Center = new Point(b.x, b.y);
                        return findDistance(circle1Center, circle2Center) <= centersDistance;
                    };
                    return (allBubbles
                        .filter(function (b) { return b !== bubble; })
                        .filter(isCollidingWithBubble)
                        .length === 0);
                };
            };
            GameScene.prototype.findAnimalsCollidingWithBubble = function (bubble, animals) {
                var centersDistance = Bubble.Radius + Animal.Radius;
                var circle1Center = new Point(bubble.x, bubble.y);
                var isAnimalColliding = function (a) {
                    var circle2Center = new Point(a.x, a.y);
                    return findDistance(circle1Center, circle2Center) <= centersDistance;
                };
                return animals.filter(isAnimalColliding);
            };
            GameScene.prototype.isCollidingWithAnyLava = function (lavas) {
                return function (b) { return (lavas
                    .filter(function (l) { return Math.sqrt(Math.pow(b.y - l.y, 2) + Math.pow(b.x - l.x, 2)) < 30; })
                    .length > 0); };
            };
            return GameScene;
        }(BubbleGunner.Scene));
        Game.GameScene = GameScene;
    })(Game = BubbleGunner.Game || (BubbleGunner.Game = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=game.js.map