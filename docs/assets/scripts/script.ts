namespace Script {
    import MouseEvent = createjs.MouseEvent;
    import Stage = createjs.Stage;
    import Shape = createjs.Shape;
    import Ticker = createjs.Ticker;
    import Tween = createjs.Tween;
    import Ease = createjs.Ease;
    import Touch = createjs.Touch;
    import Text = createjs.Text;

    let isMobile = Touch.isSupported() === true;

    let canvas: HTMLCanvasElement;
    let stage: Stage;
    let bg: Shape;
    let circle: Shape;
    let scoreText: Text;
    let score = 0;

    let counter = 7;
    let counterInterval: number;
    let counterText: Text;

    const hexValues = "0123456789ABCDEF";

    function generateColor(): string {
        let color = `#`;

        for (let i = 0; i < 6; i++) {
            let i = (Math.random() * 832740) % 16;
            color += hexValues.charAt(i);
        }

        return color;
    }

    function showScores() {
        if (!(this.readyState === 4 && this.status === 200)) {
            return;
        }

        let highScoreTexts: Text[] = [];

        let highScores = <IHighScore[]> JSON.parse(this.response);
        for (let i = 0; i < highScores.length; i++) {
            let score = highScores[i];
            let text = new Text(`${score.score}    ${score.user.first_name}`, `12pt sans`, `yellow`);
            text.x = (canvas.width / 2) - (text.getMeasuredWidth() / 2);
            text.y = 5 + (6 * i);
            highScoreTexts[i] = text;
            stage.addChild(text);
        }
    }

    function sendScore() {
        let scoresUrl = getScoreUrl();
        let playerid = getPlayerId();

        let xhr = new XMLHttpRequest();
        let data = <IScoreData> {
            playerId: playerid,
            score: score
        };
        xhr.open("POST", scoresUrl);
        xhr.send(JSON.stringify(data));
        xhr.addEventListener(`readystatechange`, () => {
            if (xhr.readyState === 4) {
                getScores();
            }
        });
    }

    function getScores() {
        let scoresUrl = getScoreUrl();
        let playerid = getPlayerId();

        let xhr = new XMLHttpRequest();
        xhr.addEventListener(`load`, showScores);
        xhr.open("GET", scoresUrl + `?id=${encodeURIComponent(playerid)}`);
        xhr.send();
    }

    function handleCounterInterval() {
        if (counter < 2) {
            clearInterval(counterInterval);
            stage.removeChild(circle, counterText);
            circle.removeEventListener(`pressmove`, beginMoveCircle);
            counter = null;
            counterInterval = null;
            if (botGameScoreUrlExists()) {
                sendScore();
            }
        }
        else {
            counter--;
            counterText.text = counter.toString();
        }
    }

    function beginMoveCircle(ev: MouseEvent) {
        function setBgToDark() {
            bg.graphics
                .clear()
                .beginFill(`#555`)
                .drawRect(0, 0, canvas.width, canvas.height);
        }

        let distance = Math.sqrt(
            Math.pow(circle.x - ev.stageX, 2) +
            Math.pow(circle.y - ev.stageY, 2)
        );
        distance = Math.floor(distance * Math.random() / 10);
        score += distance;
        scoreText.text = score.toString();

        let bgColor = `#458`;
        let distanceThreshold = 12;
        if (isMobile) {
            distanceThreshold = 3;
        }
        if (distance > distanceThreshold) {
            bgColor = generateColor();
        }

        bg.graphics
            .clear()
            .beginFill(bgColor)
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

        scoreText = new Text(score.toString(), `14pt sans`, `yellow`);
        scoreText.x = 4;
        scoreText.y = 7;
        stage.addChild(scoreText);

        counterText = new Text(counter.toString(), `14pt sans`, `#fff`);
        counterText.x = canvas.width - counterText.getMeasuredWidth() - 10;
        counterText.y = 7;
        stage.addChild(counterText);
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

        counterInterval = setInterval(handleCounterInterval, 1 * 1000);
    }
}

window.addEventListener(`load`, Script.init);
