namespace BubbleGunner {
    import Container = createjs.Container;

    export abstract class SceneBase extends Container {
        public static EventChangeScene: string = `changeScene`;

        public abstract start(...args: any[]): void;
    }
}