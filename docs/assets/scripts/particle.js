var BubbleGunner;
(function (BubbleGunner) {
    var Effects;
    (function (Effects) {
        var Point = (function () {
            function Point(x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                this.x = x;
                this.y = y;
            }
            return Point;
        }());
        var Range = (function () {
            function Range(min, max) {
                this.min = min;
                this.max = max;
            }
            return Range;
        }());
        var RGBA = (function () {
            function RGBA(r, g, b, a) {
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
            RGBA.prototype.get = function () {
                return "rgba(" + Math.round(this.r) + "," + Math.round(this.g) + "," + Math.round(this.b) + "," + Math.round(this.a) + ")";
            };
            ;
            RGBA.rand = function (min, max) {
                return (Math.floor(Math.random() * (max * 1000 - min * 1000 + 1)) + min * 1000) / 1000;
            };
            RGBA.getRandom = function (min, max) {
                return new RGBA(this.rand(min.r, max.r), this.rand(min.g, max.g), this.rand(min.b, max.b), this.rand(min.a, max.a));
            };
            return RGBA;
        }());
        var Particle = (function () {
            function Particle() {
                this._lifetime = 100;
                this._radius = 10;
                this._startColour = new RGBA(255, 0, 0, 255);
                this._endColour = new RGBA(255, 0, 0, 0);
                this._position = { x: 0, y: 0 };
                this._velocity = { x: 0, y: 0 };
                this._shape = null;
            }
            Particle.prototype.isDead = function () {
                return this._lifetime < 1 || (this._shape != null && this._shape.scaleX >= 0);
            };
            Particle.prototype.update = function (stage) {
                this._lifetime--;
                if (this._shape == null) {
                    this._shape = new createjs.Shape();
                    this._shape.graphics.beginRadialGradientFill([this._startColour.get(), this._endColour.get()], [0, 1], this._radius * 2, this._radius * 2, 0, this._radius * 2, this._radius * 2, this._radius);
                    this._shape.graphics.drawCircle(this._radius * 2, this._radius * 2, this._radius);
                    createjs.Tween.get(this._shape)
                        .wait(this._lifetime * .7)
                        .to({ alpha: 0.5, useTicks: true }, this._lifetime);
                    createjs.Tween.get(this._shape)
                        .wait(this._lifetime * .5)
                        .to({ scaleX: 0, useTicks: true }, this._lifetime);
                    createjs.Tween.get(this._shape)
                        .wait(this._lifetime * .5)
                        .to({ scaleY: 0, useTicks: true }, this._lifetime);
                    stage.addChild(this._shape);
                }
                this._shape.x = this._position.x;
                this._shape.y = this._position.y;
                this._position.x += this._velocity.x;
                this._position.y += this._velocity.y;
            };
            ;
            Particle.prototype.dispose = function (stage) {
                stage.removeChild(this._shape);
            };
            ;
            Object.defineProperty(Particle.prototype, "lifetime", {
                set: function (lifetime) {
                    this._lifetime = lifetime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Particle.prototype, "startColour", {
                set: function (rgba) {
                    this._startColour = rgba;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Particle.prototype, "endColour", {
                set: function (rgba) {
                    this._endColour = rgba;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Particle.prototype, "radius", {
                set: function (radius) {
                    this._radius = radius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Particle.prototype, "position", {
                set: function (point) {
                    this._position = point;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Particle.prototype, "velocity", {
                set: function (point) {
                    this._velocity = point;
                },
                enumerable: true,
                configurable: true
            });
            return Particle;
        }());
        var ParticleEmitter = (function () {
            function ParticleEmitter() {
                this._count = 100;
                this._lifetime = new Range(10, 50);
                this._velocityX = new Range(0, 0);
                this._velocityY = new Range(0, 0);
                this._positionOffsetX = new Range(0, 0);
                this._positionOffsetY = new Range(0, 0);
                this._position = new Point();
                this._radius = new Range(5, 10);
                this._startColour = new Range(new RGBA(200, 80, 0, 255), new RGBA(255, 160, 0, 255));
                this._endColour = new Range(new RGBA(220, 0, 0, 0), new RGBA(255, 0, 0, 0));
            }
            ParticleEmitter.prototype.update = function (stage) {
                this._particles.forEach(function (p, i, array) {
                    if (p.isDead()) {
                        p.dispose(stage);
                        array.splice(i, 1);
                    }
                    else {
                        p.update(stage);
                    }
                });
                if (this._particles.length < this._count) {
                    var p = new Particle();
                    p.lifetime = RGBA.rand(this._lifetime.min, this._lifetime.max);
                    p.position = {
                        x: this._position.x + RGBA.rand(this._positionOffsetX.min, this._positionOffsetX.max),
                        y: this._position.y + RGBA.rand(this._positionOffsetY.min, this._positionOffsetY.max)
                    };
                    p.radius = RGBA.rand(this._radius.min, this._radius.max);
                    p.velocity = {
                        x: RGBA.rand(this._velocityX.min, this._velocityX.max),
                        y: RGBA.rand(this._velocityY.min, this._velocityY.max)
                    };
                    p.startColour = RGBA.getRandom(this._startColour.min, this._startColour.max);
                    p.endColour = RGBA.getRandom(this._endColour.min, this._endColour.max);
                    this._particles.push(p);
                }
            };
            return ParticleEmitter;
        }());
        Effects.ParticleEmitter = ParticleEmitter;
    })(Effects = BubbleGunner.Effects || (BubbleGunner.Effects = {}));
})(BubbleGunner || (BubbleGunner = {}));
//# sourceMappingURL=particle.js.map