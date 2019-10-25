import { Ship, Size, Pos } from './core-models';

export interface PreparationArgs {
    size: Size;
    ships: Ship[];

    // TEMP
    miniGameSecret: number;
}

export interface AddChallengeArgs {
    opponentUid: string;
}

export interface ShootArgs {
    targetPos: Pos;

    // TEMP
    miniGameGuess: number;
}
