namespace BubbleGunner.Game {
    import Tween = createjs.Tween;
    import Bitmap = createjs.Bitmap;
    import Point = createjs.Point;

    export class LavaPiece extends Bitmap {
        public static EventFell: string = `fell`;
        public static Radius: number = 30;
        private static Speed: number = 400;

        public startPoint: Point;
        public endPoint: Point;
        public speed: number;

        constructor(startX: number) {
            super(loader.getResult(`game-lava`));

            this.startPoint = new Point(startX, -LavaPiece.Radius * 2);
            this.regX = this.regY = LavaPiece.Radius;
            this.x = this.startPoint.x;
            this.y = this.startPoint.y;
        }

        public moveTo(point: Point): Tween {
            this.endPoint = point;

            return Tween.get(this)
                .to({
                    x: this.endPoint.x,
                    y: this.endPoint.y,
                }, getTweenDurationMSecs(this.startPoint, this.endPoint, LavaPiece.Speed))
                .call(() => this.dispatchEvent(new Event(LavaPiece.EventFell)));
        }
    }
}