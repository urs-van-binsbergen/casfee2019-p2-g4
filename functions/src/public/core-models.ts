// Type definitions (used server AND client side)


export interface Pos {
    x: number;
    y: number;
}

export interface Ship {
    pos: Pos; // (top-left)
    length: number;
    isVertical: boolean;
    isSunk: boolean;
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

export enum PlayerLevel {
    Shipboy,
    Seaman,
    Captain,
    Admiral
}

export interface PlayerInfo {
    uid: string;
    displayName: string | null;
    avatarFileName: string | null;
    level: PlayerLevel;
}

export enum PlayerStatus {
    Preparing,
    Waiting,
    Playing
}


export interface Player {
    uid: string;
    playerStatus: PlayerStatus;
    fields: Array<TargetField>;
    ships: Array<Ship>;
    miniGameNumber: number; // TEMP
    miniGameGuesses: number[]; // TEMP
    opponent: Opponent | null;
    canShootNext: boolean; 
}

export interface Opponent {
    battleId: string;
    playerInfo: PlayerInfo;
    fields: Array<TargetField>;
    sunkShips: Array<Ship>;
    countdownDate: Date;
}

export interface Challenge {
    challengerInfo: PlayerInfo;
    challengeDate: Date;
}

export interface WaitingPlayer {
    uid: string;
    playerInfo: PlayerInfo;
    challenges: Array<Challenge>;
}

export enum BattleResult {
    Victory,
    Waterloo,
    Capitulation
}

export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    avatarFileName: string | null;
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

