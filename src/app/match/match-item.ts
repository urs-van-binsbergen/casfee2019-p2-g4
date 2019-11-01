export class MatchItem {
    private _opponentName: string;
    private _isOpponentChellanged: boolean;
    private _isOpponentChellanging: boolean;

    constructor(opponentName: string) {
        this._opponentName = opponentName;
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
