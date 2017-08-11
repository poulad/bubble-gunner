namespace BubbleGunner.Effects {

    import Shape = createjs.Shape;
    import Stage = createjs.Stage;

    class Point {
        constructor(public x: number = 0, public y: number = 0) {}
    }

    class Range<T> {
        constructor(public min: T, public max: T){}
    }

    class RGBA {
        constructor(private r: number, private g: number, private b: number , private a: number) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        get() {
            return "rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+","+Math.round(this.a)+")";
        };

        public static rand(min:number, max:number): number{
            return (Math.floor(Math.random() * (max*1000 - min*1000 + 1)) + min*1000)/1000;
        }

        public static getRandom(min:RGBA, max:RGBA): RGBA {
            return new RGBA(
                this.rand(min.r, max.r),
                this.rand(min.g, max.g),
                this.rand(min.b, max.b),
                this.rand(min.a, max.a));
        }
    }

    class Particle {
        private _lifetime: number;
        private _radius: number;
        private _startColour: RGBA;
        private _endColour: RGBA;
        private _position: Point;
        private _velocity: Point;
        private _shape: Shape;

        constructor() {
            this._lifetime = 100;
            this._radius = 10;
            this._startColour = new RGBA(255,0,0,255);
            this._endColour = new RGBA(255,0,0,0);
            this._position = { x: 0, y: 0 };
            this._velocity = { x: 0, y: 0 };
            this._shape = null;
        }

        public isDead():boolean {
            return this._lifetime < 1 || (this._shape != null && this._shape.scaleX >= 0);
        }

        public update(stage: Stage) {
            this._lifetime--;

            if (this._shape == null) {
                this._shape = new createjs.Shape();
                this._shape.graphics.beginRadialGradientFill(
                    [this._startColour.get(), this._endColour.get()],
                    [0, 1],
                    this._radius*2,
                    this._radius*2,
                    0,
                    this._radius*2,
                    this._radius*2,
                    this._radius);
                this._shape.graphics.drawCircle(this._radius*2, this._radius*2, this._radius);

                createjs.Tween.get(this._shape)
                    .wait(this._lifetime*.7)
                    .to({ alpha: 0.5, useTicks: true }, this._lifetime);

                createjs.Tween.get(this._shape)
                    .wait(this._lifetime*.5)
                    .to({ scaleX: 0, useTicks: true }, this._lifetime);

                createjs.Tween.get(this._shape)
                    .wait(this._lifetime*.5)
                    .to({ scaleY: 0, useTicks: true }, this._lifetime);

                stage.addChild(this._shape);
            }

            this._shape.x = this._position.x;
            this._shape.y = this._position.y;

            this._position.x += this._velocity.x;
            this._position.y += this._velocity.y;
        };

        public dispose(stage: Stage) {
            stage.removeChild(this._shape);
        };

        public set lifetime(lifetime: number) {
            this._lifetime = lifetime;
        }
        public set startColour(rgba: RGBA) {
            this._startColour = rgba;
        }
        public set endColour(rgba: RGBA) {
            this._endColour = rgba;
        }
        public set radius(radius: number) {
            this._radius = radius;
        }
        public set position(point: Point) {
            this._position = point;
        }
        public set velocity(point: Point) {
            this._velocity = point;
        }
    }


    export class ParticleEmitter {
        private _count: number;
        private _particles: Particle[];
        private _lifetime: Range<number>;
        private _velocityX: Range<number>;
        private _velocityY: Range<number>;
        private _positionOffsetX: Range<number>;
        private _positionOffsetY: Range<number>;
        private _position: Point;
        private _radius: Range<number>;
        private _startColour: Range<RGBA>;
        private _endColour: Range<RGBA>;

        constructor() {
            this._count = 100;
            this._lifetime = new Range(10,50);
            this._velocityX = new Range(0,0);
            this._velocityY = new Range(0,0);
            this._positionOffsetX = new Range(0,0);
            this._positionOffsetY = new Range(0,0);
            this._position = new Point();
            this._radius = new Range(5,10);
            this._startColour = new Range(
                new RGBA(200,80,0,255),
                new RGBA(255,160,0,255)
            );
            this._endColour = new Range(
                new RGBA(220,0,0,0),
                new RGBA(255,0,0,0)
            );
        }

        public update(stage:Stage) {
            this._particles.forEach((p,i,array) => {
                if (p.isDead()) {
                    p.dispose(stage);
                    array.splice(i,1);
                } else {
                    p.update(stage);
                }
            });

            if(this._particles.length < this._count) {
                let p = new Particle();
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
        }
    }
}