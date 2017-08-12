namespace BubbleGunner.Game {
    import Tween = createjs.Tween;
    import Bitmap = createjs.Bitmap;
    import Point = createjs.Point;

    export class Animal extends Bitmap {
        public static EventFell: string = `fell`;
        public static Radius: number = 40;
        public static Speed: number = 330;

        public startPoint: Point;
        public endPoint: Point;

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

            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, Animal.Speed))
                .call(this.fallCallback.bind(this));
        }

        public continueFall(): Tween {
            Tween.removeTweens(this);
            let newEndPoint = new Point(this.endPoint.x, NormalHeight);
            return this.moveTo(newEndPoint);
        }

        private fallCallback(): Tween {
            return Tween.get(this)
                .to({alpha: .3}, 300)
                .call(this.dispatchEvent.bind(this, Animal.EventFell));
        }

        private static getRandomAnimalImage(): Object {
            let id = Math.floor(Math.random() * 34234) % 4;
            return loader.getResult(`game-animal${id}`);
        }
    }
}