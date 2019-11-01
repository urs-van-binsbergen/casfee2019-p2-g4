export class MatchItem {
    private _victories: number;
    private _defeats: number;
    private _opponentName: string;
    private _isOpponentChellanged: boolean;
    private _isOpponentChellanging: boolean;

    constructor(opponentName: string) {
        this._victories = 12;
        this._defeats = 23;
        this._opponentName = opponentName;
        this._isOpponentChellanged = false;
        this._isOpponentChellanging = true;
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

    get isOpponentChellanged(): boolean {
        return this._isOpponentChellanged;
    }

    get isOpponentChellanging(): boolean {
        return this._isOpponentChellanging;
    }

    challenge(challenge: boolean) {
        this._isOpponentChellanged = challenge;
    }
}
