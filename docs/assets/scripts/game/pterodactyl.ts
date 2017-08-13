namespace BubbleGunner.Game {
    import Tween = createjs.Tween;
    import Point = createjs.Point;
    import Sprite = createjs.Sprite;
    import SpriteSheet = createjs.SpriteSheet;

    export class Pterodactyl extends Sprite {
        public static Radius: number = 87.5;

        private static Speed: number = 250;
        private static SpriteSheetData = {
            images: [],
            frames: [
                [0, 176, 175, 175],
                [0, 528, 175, 175],
                [176, 0, 175, 175],
                [176, 176, 175, 175],
                [0, 352, 175, 175],
                [176, 352, 175, 175],
                [352, 0, 175, 175],
                [352, 176, 175, 175],
                [352, 352, 175, 175],
                [0, 0, 175, 175],
                [176, 528, 175, 175],
                [352, 528, 175, 175],
                [528, 0, 175, 175],
                [528, 176, 175, 175],
                [528, 352, 175, 175],
                [528, 528, 175, 175],
                [0, 704, 175, 175],
                [176, 704, 175, 175]
            ],
            framerate: 18,
            animations: {
                "fly": [0, 17]
            }
        };

        constructor(private _startPoint: Point) {
            super(Pterodactyl.getSpriteSheet());
            this.regX = this.regY = Pterodactyl.Radius;
            this.x = _startPoint.x;
            this.y = _startPoint.y;
        }

        public flyTo(endPoint: Point): Tween {
            let tween = Tween.get(this)
                .to({
                    x: endPoint.x,
                    y: endPoint.y
                }, getTweenDurationMSecs(this._startPoint, endPoint, Pterodactyl.Speed));
            this.gotoAndPlay(`fly`);
            return tween;
        }

        private static getSpriteSheet(): SpriteSheet {
            if (Pterodactyl.SpriteSheetData.images.length === 0) {
                Pterodactyl.SpriteSheetData.images[0] = loader.getResult(`game-pterodactyl`);
            }

            return new SpriteSheet(Pterodactyl.SpriteSheetData);
        }
    }
}