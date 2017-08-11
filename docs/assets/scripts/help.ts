namespace BubbleGunner.Help {
    import Bitmap = createjs.Bitmap;

    export class HelpScene extends Scene {

        constructor() {
            super();

            let back = new Bitmap(loader.getResult(`back`));
            back.x = 30;
            back.y = 30;
            back.on(`click`, this.dispatchBackToMenuEvent, this);
            back.cursor = `pointer`;
            back.scaleX = back.scaleY = 1.5;
            this.addChild(back);
        }

        public start(...args: any[]): void {

        }

        private dispatchBackToMenuEvent(): void {
            this.dispatchEvent(new SceneEvent(Scene.EventChangeScene, SceneType.Menu));
        }
    }
}