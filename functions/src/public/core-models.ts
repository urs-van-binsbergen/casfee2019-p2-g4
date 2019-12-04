import { Pos, Orientation, Size } from './geometry';

// Firestore data models (also used as R/W DTOs)

export interface Ship {

    /*
     * Position of the stern (german "Heck")
     */
    pos: Pos;

    /*
     * Length of the ship
     */
    length: number;

    /*
     * Orientation North/East/South/West seen from the stern Pos
     */
    orientation: Orientation;

    /*
     * The ship's design (as written and interpreted by the frontend)
     */
    design: number;

    /*
     * Hit fields, indexed starting from the stern = 0 etc.
     */
    hits: number[];

    /*
     * True if all fields covered by the ship were hit
     */
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

export interface Board {
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
     * Player preparing his ship layout
     * (not seen in the field currently because players get status 'Waiting'
     * as soon they submit their prepared ship layout)
     */
    Preparing,

    /* Player is waiting, did not create a match with another player yet */
    Waiting,

    /* Player is in the battle with another player */
    InBattle,

    /* Player has won the last battle */
    Victory,

    /* Player has lost the last battle */
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

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    avatarFileName: string | null;
    level: PlayerLevel;
}

export interface HallEntry {
    playerInfo: PlayerInfo;
    numberOfVictories: number;
    numberOfWaterloos: number;
}

export interface HistoricBattle {
    battleId: string;
    endDate: Date;
    winnerUid: string;
    loserUid: string;
    uids: string[];
}
