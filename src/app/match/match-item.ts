export class MatchItem {
    private _opponentUid: string;
    private _victories: number;
    private _defeats: number;
    private _opponentName: string;
    private _isOpponentChallenged: boolean;
    private _isOpponentChallenging: boolean;

    constructor(
        opponentUid: string,
        opponentName: string,
        isOpponentChallenged: boolean,
        isOpponentChallenging: boolean
    ) {
        this._opponentUid = opponentUid;
        this._victories = 12;
        this._defeats = 23;
        this._opponentName = opponentName;
        this._isOpponentChallenged = isOpponentChallenged;
        this._isOpponentChallenging = isOpponentChallenging;
    }

    get opponentUid(): string {
        return this._opponentUid;
    }

    get victories(): number {
        return this._victories;
    }

    get defeats(): number {
        return this._defeats;
    }

    get opponentName(): string {
        return this._opponentName;
    }

    get isOpponentChallenged(): boolean {
        return this._isOpponentChallenged;
    }

    get isOpponentChallenging(): boolean {
        return this._isOpponentChallenging;
    }

    challenge(challenge: boolean) {
        this._isOpponentChallenged = challenge;
    }

    challenging(challenging: boolean) {
        this._isOpponentChallenging = challenging;
    }
}
