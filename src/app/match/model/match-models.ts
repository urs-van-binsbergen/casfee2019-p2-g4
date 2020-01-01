export enum MatchStatus {
    Idle,
    Started,
    Completed
}

export interface MatchItem {
    opponentUid: string;
    victories: number;
    defeats: number;
    opponentName: string;
    isOpponentChallenged: boolean;
    isOpponentChallenging: boolean;
}
