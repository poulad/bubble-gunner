namespace BubbleGunner.Game {
    import Shape = createjs.Shape;
    import Tween = createjs.Tween;
    import Point = createjs.Point;

    export class Bubble extends Shape {
        public static EventPopped: string = `popped`;
        public static EventAscended: string = `ascended`;
        public static EventRescuedAnimal: string = `rescued`;
        public static Radius: number = 46;

        private static Speed: number = 450;
        private static AscendingSpeed: number = 150;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;
        public containsAnimal: boolean = false;
        public isPopping: boolean = false;

        private _animal: Animal;
        private _pulseCount = 0;
        private _tickListener: Function;

        constructor(from: Point, to: Point) {
            super();
            this.name = `Bubble ${generateId()}`;

            this.graphics
                .beginFill('rgba(255, 255, 255, .1)')
                .beginStroke('rgba(255, 255, 255, .8)')
                .setStrokeStyle(2)
                .drawCircle(0, 0, Bubble.Radius);

            this.startPoint = from;
            this.x = this.startPoint.x;
            this.y = this.startPoint.y;
            this.endPoint = to;
        }

        public move(): Tween {
            this._tickListener = this.on(`tick`, this.handleTick, this);

            this.updateEndPoint();

            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Bubble.Speed))
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventAscended)));
        }

        public takeAnimal(animal: Animal): Tween {
            this._animal = animal;
            this.containsAnimal = true;
            Tween.removeTweens(this._animal);

            this.x = this._animal.x;
            this.y = this._animal.y;

            // make sure bubble is in full scale (for animals close to gun muzzle)
            this.scaleX = this.scaleY = 1;

            this.startPoint = new Point(this.x, this.y);
            this.endPoint = new Point(this.x, -Animal.Radius);

            return Tween.get(this, {override: true})
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Bubble.AscendingSpeed))
                .call(this.dispatchEvent.bind(this, new Event(Bubble.EventRescuedAnimal)));
        }

        public getAnimal(): Animal {
            return this._animal;
        }

        public pop(): void {
            this.isPopping = true;
            this.off(`tick`, this._tickListener);

            if (this.containsAnimal) {
                this._animal.continueFall();
                delete this._animal;
                this._animal = null;
                this.containsAnimal = false;
            }

            this.alpha = 0;
            playSound(SoundAsset.BubblePop);
            this.dispatchEvent(new Event(Bubble.EventPopped));
        }

        private handleTick(): void {
            if (
                this.x < (0 - Bubble.Radius * this.scaleX) ||
                (NormalWidth + Bubble.Radius * this.scaleX) < this.x
            ) {
                // Bubble is out of the visual horizon of canvas
                this.dispatchEvent(new Event(Bubble.EventAscended));
            }

            if (this.containsAnimal) {
                this._animal.x = this.x;
                this._animal.y = this.y;
            }

            this.pulse();
        }

        private pulse(): void {
            this.alpha = Math.cos(this._pulseCount++ * 0.1) * 0.4 + 0.85;
        }

        private updateEndPoint(): void {
            /*
             line equation:
             y = mx + b
             m = (y2 - y1) / (x2 - x1)
             */

            let finalY = 0; // Bubble goes up
            if (this.endPoint.y >= this.startPoint.y) finalY = NormalHeight; // Bubble goes down

            const m = (this.startPoint.y - this.endPoint.y) / (this.startPoint.x - this.endPoint.x);
            const b = this.endPoint.y - m * this.endPoint.x;

            this.endPoint.y = finalY;
            this.endPoint.x = (this.endPoint.y - b) / m;
        }
    }
}