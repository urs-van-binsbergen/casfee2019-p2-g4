import { Ship } from './core-models';

export interface PreparationArgs {
    miniGameNumber: number;
    ships: Array<Ship>;
}

export interface AddChallengeArgs {
    opponentUid: string;
}

export interface MakeGuessArgs {
    currentGuess: number;
}
