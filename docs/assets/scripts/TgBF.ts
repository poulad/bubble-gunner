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

function getPlayerId(): string {
    return getValueFromUrl(location.href, `id`);
}

function getScoreUrl(): string {
    return getValueFromUrl(location.href, `gameScoreUrl`);
}

function botGameScoreUrlExists(): boolean {
    let scoreUrl = getScoreUrl();
    return scoreUrl !== null && scoreUrl.toString().length > 1;
}

interface IUser {
    id: number,
    first_name: string,
    last_name: string,
    userName: string,
    languageCode: string
}

interface IHighScore {
    position: number,
    score: number,
    user: IUser
}

interface IScoreData {
    playerId: string,
    score: number
}