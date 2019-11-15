// Type definitions (used server AND client side)


export interface Pos {
    x: number;
    y: number;
}

export interface Size {
    w: number;
    h: number;
}

/*
 * Grid which holds its fields in a flat list (instead of 2-dimensional array)
 * (Reason for this: Firestore does not allow multidimensional arrays)
 */
export interface FlatGrid<TField> {
    size: Size;
    fields: TField[];
}

export interface Ship {
    pos: Pos; // (top-left)
    length: number;
    isVertical: boolean;
    hits: number[]; // hit field index from top-left
    isSunk: boolean;
}

export enum FieldStatus {
    Unknown = 0,
    Miss = 1,
    Hit = 2
}

export interface Field {
    pos: Pos;
    status: FieldStatus;
}

export interface Board extends FlatGrid<Field> {
    size: Size;
    fields: Field[];
    ships: Ship[];
}

export enum PlayerLevel {
    Shipboy,
    Seaman,
    Captain,
    Admiral
}

export interface PlayerInfo {
    uid: string;
    displayName: string | null;
    avatarFileName: string | null;
    level: PlayerLevel;
}

export enum PlayerStatus {
    /*
     * Player still preparing (currently not used, because player enters
     * waiting room as soon as he submits his preparation)
     */
    Preparing,

    /* Player is waiting, did not create a match with another player yet */
    Waiting,

    /* Player is in the battle with another player */
    InBattle,

    Victory,

    Waterloo
}


export interface Player {
    uid: string;
    playerStatus: PlayerStatus;

    board: Board;

    battle: Battle | null;
    canShootNext: boolean;
    lastMoveDate: Date;
}

/*
 * Battle (as seen from one player)
 */
export interface Battle {
    battleId: string;
    opponentInfo: PlayerInfo;
    opponentLastMoveDate: Date;
    targetBoard: Board;
}

export interface Challenge {
    challengerInfo: PlayerInfo;
    challengeDate: Date;
}

export interface WaitingPlayer {
    uid: string;
    playerInfo: PlayerInfo;
    challenges: Challenge[];
}

export enum BattleResult {
    Victory,
    Waterloo,
    Capitulation
}

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    avatarFileName: string | null;
    level: PlayerLevel;
    numberOfVictories: number;
}

export interface HallEntry {

    playerInfo: PlayerInfo;
    numberOfVictories: number;
}

export interface HistoricBattle {

    battleId: string;
    endDate: Date;
    winnerUid: string;
    loserUid: string;
    isCapitulation: boolean;
}
