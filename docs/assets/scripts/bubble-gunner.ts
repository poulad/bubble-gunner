namespace BubbleGunner {
    import Ticker = createjs.Ticker;
    import Touch = createjs.Touch;
    import EventDispatcher = createjs.EventDispatcher;
    import Stage = createjs.Stage;
    import MenuScene = BubbleGunner.Menu.MenuScene;
    import GameScene = BubbleGunner.Game.GameScene;
    import PreloadScene = BubbleGunner.Menu.PreloadScene;
    import HelpScene = BubbleGunner.Help.HelpScene;
    import GameOverScene = BubbleGunner.GameOver.GameOverScene;

    export class GameManager extends EventDispatcher {
        private _currentScene: Scene;

        constructor(private _stage: Stage) {
            super();
        }

        public startGame() {
            Ticker.framerate = 60;
            Ticker.addEventListener(`tick`, this._stage);
            Touch.enable(this._stage);
            this._stage.enableMouseOver(10);

            this.startNewScene(SceneType.Preload);
        }

        private startNewScene(sceneType: SceneType, ...sceneArgs: any[]): void {
            this._stage.removeAllChildren();
            this._currentScene = GameManager.createScene(sceneType);
            this._stage.addChild(this._currentScene);

            this._currentScene.on(Scene.EventChangeScene, this.changeSceneHandler, this);
            this._currentScene.start();
        }

        private changeSceneHandler(evt: SceneEvent): void {
            this.startNewScene(evt.toScene, evt.startArgs);
        }

        private static createScene(sceneType: SceneType): Scene {
            let scene: Scene;
            switch (sceneType) {
                case SceneType.Preload:
                    scene = new PreloadScene();
                    break;
                case SceneType.Menu:
                    scene = new MenuScene();
                    break;
                case SceneType.Help:
                    scene = new HelpScene();
                    break;
                case SceneType.Game:
                    scene = new GameScene();
                    break;
                case SceneType.GameOver:
                    scene = new GameOverScene();
                    break;
                default:
                    throw new Error(`Scene type ${sceneType} not implemented yet`);
            }
            return scene;
        }
    }
}