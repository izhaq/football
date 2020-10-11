import { Observable, Subject, ReplaySubject, from, of, range } from 'https://dev.jspm.io/rxjs@6/_esm2015';
import { map, filter, switchMap } from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
class PlayerElement {
    constructor(selector, name, scoreService) {
        this.element = document.querySelector(selector);
        this.name = name;
        this.scoreService = scoreService;
        this.scoreService.scoreObservable
            .pipe(filter( data => data.name === this.name), map( data => this.score = data.score))
            .subscribe(score => this.onGoal(score));
        this.onGoal(0);
    }
    update(string) {
        this.element.innerText = string;
    }
    onGoal(score) {
        this.score = score;
        this.update(`${this.name}:${this.score}`);
    }
    scoreGoal() {
        this.scoreService.scoreGoalByPlayer(this);
    }
    onWin() {
        this.update(`${this.name}:${this.score} (Winner)`);
    }
}
class ScoreService {
    observable$ = null;
    constructor() {
        this.score = {};
		if (!ScoreService.instance) {
            this.scoreSubject = new Subject(1);
		    this.observable$ = this.scoreSubject.asObservable();
			ScoreService.instance = this;
		}
		return ScoreService.instance;
	}

	initPlayer(player) {
        this.score[player.name] = 0;
    }

    scoreGoalByPlayer(player) {
        ++this.score[player.name];
        this.scoreSubject.next({ name: player.name, score: this.score[player.name]})
        if(this.score[player.name] === 3) {
            player.onWin();
        }
    }
    get scoreObservable() {
        return this.observable$;
    }
}

let player1, player2;
const initGame = () => {
    player1 = new PlayerElement('.player1', 'David', new ScoreService());
    player2 = new PlayerElement('.player2', 'Goliath', new ScoreService());
    new ScoreService().initPlayer(player1);
    new ScoreService().initPlayer(player2);
}

const initDemoPLay = () => {
    player1.scoreGoal();
    setTimeout(() => player2.scoreGoal(), 10000);
    setTimeout(() => player2.scoreGoal(), 12000);
    setTimeout(() => player1.scoreGoal(), 20000);
    setTimeout(() => player1.scoreGoal(), 25000);
}
initGame();
initDemoPLay();
