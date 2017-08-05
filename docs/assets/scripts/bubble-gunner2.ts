namespace BubbleGunner {
    import Container = createjs.Container;
    import Event = createjs.Event;
    import LoadQueue = createjs.LoadQueue;

    export let canvas: HTMLCanvasElement;
    export const NormalWidth: number = 800;
    export const NormalHeight: number = 600;

    export class SceneEvent extends Event {
        public startArgs: any[];

        constructor(type: string, public toScene: SceneType, ...startArgs: any[]) {
            super(type, undefined, undefined);
            this.startArgs = startArgs;
        }
    }

    export abstract class Scene extends Container {
        public static EventChangeScene: string = `changeScene`;

        public abstract start(...args: any[]): void;
    }

    export enum SceneType {
        Preload,
        Menu,
        Help,
        Game,
        GameOver
    }

    export let loader: LoadQueue;
}