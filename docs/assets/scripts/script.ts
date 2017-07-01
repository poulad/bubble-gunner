namespace Script {
    import MouseEvent = createjs.MouseEvent;
    import Stage = createjs.Stage;
    import Shape = createjs.Shape;
    import Ticker = createjs.Ticker;
    import Tween = createjs.Tween;
    import Ease = createjs.Ease;
    import Touch = createjs.Touch;

    let canvas: HTMLCanvasElement;
    let stage: Stage;
    let bg: Shape;
    let circle: Shape;


    function beginMoveCircle(ev: MouseEvent) {
        function setBgToDark() {
            bg.graphics
                .clear()
                .beginFill(`#555`)
                .drawRect(0, 0, canvas.width, canvas.height);
        }

        bg.graphics
            .clear()
            .beginFill(`#458`)
            .drawRect(0, 0, canvas.width, canvas.height);

        Tween.get(circle)
            .to({
                x: ev.stageX,
                y: ev.stageY
            }, undefined, Ease.backInOut)
            .call(setBgToDark);
    }

    function draw() {
        bg = new Shape();
        bg.graphics
            .beginFill('#555')
            .drawRect(0, 0, canvas.width, canvas.height);
        stage.addChild(bg);

        circle = new Shape();
        circle.graphics
            .beginFill(`red`)
            .beginStroke('yellow')
            .drawCircle(0, 0, 20);

        circle.x = canvas.width / 2;
        circle.y = canvas.height / 2;

        stage.addChild(circle);

        circle.addEventListener(`pressmove`, beginMoveCircle);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    export function init() {
        canvas = <HTMLCanvasElement> document.getElementById(`canvas`);
        window.addEventListener(`resize`, resizeCanvas, false);
        resizeCanvas();

        stage = new Stage(canvas);
        Touch.enable(stage);
        Ticker.framerate = 60;
        Ticker.addEventListener(`tick`, () => stage.update());

        draw();
    }
}

window.addEventListener(`load`, Script.init);
