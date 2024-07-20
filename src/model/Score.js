const SCORE = {
    score: 0,
    addition: 0,
    level: 0,
    newLevel: null,
    win: false,
    lose: false,
    reset: function() {
        this.score = 0;
        this.addition = 0;
        this.level = 0;
        this.win = false;
        this.lose = false;
        this.newLevel = null;
    }
}

export default SCORE;

export const LEVEL = {
    Easy: 0,
    Medium: 1,
    Hard: 2,
}