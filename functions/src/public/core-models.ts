export interface Pos {
    x: number;
    y: number;
}

export interface Ship {
    pos: Pos;
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
    displayName: string;
    avatarFileName: string;
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
    opponent: Opponent | null;
}

export interface Opponent {
    battleId: string;
    playerInfo: PlayerInfo;
    fields: Array<TargetField>;
    sunkShips: Array<Ship>;
    countdownDate: Date;
}

export interface Challenge {
    uid: string;
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
    email: string;
    displayName: string;
    avatarFileName: string;
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

