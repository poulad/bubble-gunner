namespace BubbleGunner.Game {
    import DisplayObject = createjs.DisplayObject;
    import Point = createjs.Point;

    let id: number = 0;

    export function getPointsDistance(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));
    }

    export function getObjectsDistance(o1: DisplayObject, o2: DisplayObject): number {
        return getPointsDistance(new Point(o1.x, o1.y), new Point(o2.x, o2.y));
    }

    export function getTweenDurationMSecs(p1: Point, p2: Point, speed: number): number {
        return Math.floor(getPointsDistance(p1, p2) * 1000 / speed);
    }

    export function generateId(): number {
        return ++id;
    }
}