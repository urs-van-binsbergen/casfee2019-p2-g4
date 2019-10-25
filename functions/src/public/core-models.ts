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
 * Grid which holds its content in a flat list (insted of 2d array)
 * Firestore requirement: no multidimensional arrays.
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

export interface Field {
    pos: Pos;
    isHit: boolean;
}

export interface Board extends FlatGrid<Field> {
    size: Size;
    fields: Field[];
    ships: Ship[];
}


export enum TargetFieldStatus {
    Unknown,
    Miss,
    Hit
}

export interface TargetField {
    pos: Pos;
    status: TargetFieldStatus;
}

export interface TargetBoard extends FlatGrid<TargetField> {
    size: Size;
    fields: TargetField[];
    sunkShips: Ship[];
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

    // Mini Game (TEMP): player's secret and the opponent's knowledge about it
    miniGameSecret: number;
    miniGameLastOpponentGuess: number;
}

/*
 * Battle (as seen from one player)
 */
export interface Battle {
    battleId: string;
    opponentInfo: PlayerInfo;
    opponentLastMoveDate: Date;
    targetBoard: TargetBoard;

    // Mini Game (TEMP): players knowledge about the opponent
    miniGameGuesses: number[];
    miniGameLastGuessSign: number;
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
