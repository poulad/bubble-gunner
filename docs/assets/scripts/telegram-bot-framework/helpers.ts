namespace Telegram.Bot.Framework {
    export function gameScoreUrlExists(): boolean {
        const scoreUrl = getScoreUrl();
        return scoreUrl != undefined && scoreUrl.length > 1;
    }

    export function sendUserScore(score: number) {
        const scoresUrl = getScoreUrl();
        const playerid = getPlayerId();
        const scoreData = new ScoreData(playerid, score);
        console.debug(`Sending score to \"${scoresUrl}\"`, scoreData);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", scoresUrl);
        xhr.onreadystatechange = evt => console.debug(evt);
        xhr.send(JSON.stringify(scoreData));
    }

    function getPlayerId(): string {
        return getValueFromUrl(location.href, `id`);
    }

    function getScoreUrl(): string {
        return getValueFromUrl(location.href, `gameScoreUrl`);
    }

    function getValueFromUrl(url: string, key: string): string {
        let value: string = null;
        let tokens = url.substr(url.indexOf('#') + 1).split('&');
        for (let t of tokens) {
            if (t.match(`^${key}=.+$`)) {
                value = t.substr(key.length + 1);
                value = decodeURIComponent(value);
            }
        }
        return value;
    }
}