namespace BubbleGunner.Game {
    import Tween = createjs.Tween;
    import Bitmap = createjs.Bitmap;
    import Point = createjs.Point;

    export class Animal extends Bitmap {
        public static EventFell: string = `fell`;
        public static Radius: number = 40;
        public static Speed: number = 230;

        public startPoint: Point;
        public endPoint: Point;
        public isDying = false;

        constructor(point: Point) {
            super(Animal.getRandomAnimalImage());
            this.name = `Animal ${generateId()}`;

            this.regX = this.regY = Animal.Radius;
            this.x = point.x;
            this.y = point.y;
            this.startPoint = point;
        }

        public moveTo(point: Point): Tween {
            this.endPoint = point;

            return Tween.get(this, {override: true})
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Animal.Speed))
                .call(this.fallCallback.bind(this));
        }

        public continueFall(): Tween {
            this.startPoint = new Point(this.x, this.y);
            return this.moveTo(new Point(this.startPoint.x, NormalHeight));
        }

        private fallCallback(): Tween {
            this.isDying = true;
            return Tween.get(this, {override: true})
                .to({alpha: 0}, 500)
                .call(this.dispatchEvent.bind(this, Animal.EventFell));
        }

        private static getRandomAnimalImage(): Object {
            let id = Math.floor(Math.random() * 34234) % 4;
            return loader.getResult(`game-animal${id}`);
        }
    }
}