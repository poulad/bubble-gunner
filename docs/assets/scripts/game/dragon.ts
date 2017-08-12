namespace BubbleGunner.Game {
    import Tween = createjs.Tween;
    import Container = createjs.Container;
    import Bitmap = createjs.Bitmap;
    import Ease = createjs.Ease;
    import MouseEvent = createjs.MouseEvent;
    import Stage = createjs.Stage;
    import Point = createjs.Point;

    export class Dragon extends Container {
        public originalWidth = 140;
        public originalHeight = 408;

        private static FireRate: number = 650;

        private _body: Bitmap;
        private _hand: Bitmap;
        private _canShoot: boolean = true;
        private _gunFireTimeoutHandle: number;

        constructor() {
            super();
            this._body = new Bitmap(loader.getResult(`dragon`));

            this._hand = new Bitmap(loader.getResult(`dragon-hand`));
            this._hand.regX = 426;
            this._hand.regY = 110;
            this._hand.x = 250;
            this._hand.y = 180;
            this.addChild(this._body, this._hand);
        }

        public shootBubbleTo(point: Point): Bubble {
            if (!this._canShoot)
                return;

            this.aimGunToPoint(point);

            let gunMuzzlePoint = this.getGunMuzzleStagePoint();
            let bubble = new Bubble(gunMuzzlePoint, point);
            console.debug(`Shooting bubble from: ${gunMuzzlePoint}`);

            const targetScale = bubble.scaleX;
            bubble.scaleX = bubble.scaleY = .1;
            Tween.get(bubble)
                .to({
                    scaleX: targetScale,
                    scaleY: targetScale,
                }, 150, Ease.bounceOut);
            this.setGunFireDelay(Dragon.FireRate);
            return bubble;
        }

        public setGunFireDelay(time: number) {
            clearTimeout(this._gunFireTimeoutHandle);

            this._canShoot = false;
            this._gunFireTimeoutHandle = setTimeout(() => {
                if (this != undefined) this._canShoot = true;
            }, time);
        }

        public aimGun(evt: MouseEvent): void {
            let stage = evt.target as Stage;
            let stagePoint = new Point(evt.stageX / stage.scaleX, evt.stageY / stage.scaleY);
            // console.debug(`Mouse on stage point: ${stagePoint}`);
            this.aimGunToPoint(stagePoint);
        }

        public isReadyToShoot(): boolean {
            return this._canShoot;
        }

        private aimGunToPoint(targetPoint: Point): void {
            const minAngle = -10;

            let handRegStagePoint = this.getHandRegStagePoint();
            if (handRegStagePoint.x < targetPoint.x) {
                this.scaleX = -Math.abs(this.scaleX);
            } else {
                this.scaleX = Math.abs(this.scaleX);
            }
            handRegStagePoint = this.getHandRegStagePoint();

            let yDiff = targetPoint.y - handRegStagePoint.y;
            let xDiff = targetPoint.x - handRegStagePoint.x;

            let angle = Math.atan(yDiff / xDiff) / Math.PI * 180;
            if (this.scaleX < 0) angle *= -1;
            if (angle < minAngle) angle = minAngle;

            this._hand.rotation = angle;
            // console.debug(`aiming at angle: ${angle}`);
        }

        private getHandRegStagePoint(): Point {
            return new Point(
                this.x + this._hand.x * this.scaleX,
                this.y + this._hand.y * this.scaleY
            );
        }

        private getGunMuzzleStagePoint(): Point {
            let p: Point = new Point();

            let rotationRadians = Math.PI + this._hand.rotation * Math.PI / 180;
            if (this.scaleX < 0) {
                rotationRadians = 2 * Math.PI - rotationRadians;
            }
            let radius = 426 * this.scaleX;
            let center = this.getHandRegStagePoint();
            p.x = center.x + radius * Math.cos(rotationRadians);
            p.y = center.y + radius * Math.sin(rotationRadians);

            // console.debug(`Gun muzzle at: ${p}`);
            return p;
        }
    }
}