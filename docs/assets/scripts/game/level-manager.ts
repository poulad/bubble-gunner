namespace BubbleGunner.Game {
    import EventDispatcher = createjs.EventDispatcher;

    export class LevelManager extends EventDispatcher {
        public static EventLevelChanged: string = `levelChanged`;
        public currentLevel: number = 1;

        private static Level1MaxScore = 4;

        public getLevelMaxScore(level?: number): number {
            if (level == undefined) {
                level = this.currentLevel;
            }
            return LevelManager.Level1MaxScore * level;
        }

        public setScore(score: number): void {
            if (this.currentLevel < 3 && score > this.getLevelMaxScore()) {
                this.currentLevel++;
                this.dispatchEvent(new Event(LevelManager.EventLevelChanged));
            }
            // console.debug(`score => ${score}`);
            // console.debug(`level => ${this.currentLevel}`);
        }
    }
}