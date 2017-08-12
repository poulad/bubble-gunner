namespace BubbleGunner {
    import Event = createjs.Event;

    export class SceneEvent extends Event {
        public startArgs: any[];

        constructor(type: string, public toScene: SceneType, ...startArgs: any[]) {
            super(type, undefined, undefined);
            this.startArgs = startArgs;
        }
    }
}