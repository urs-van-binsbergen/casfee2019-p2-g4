import { PlayerLevel } from './core-models';

export const ADMIRAL_MIN_VICTORIES = 20;
export const CAPTAIN_MIN_VICTORIES = 10;
export const SEAMAN_MIN_VICTORIES = 5;

export function getPlayerLevel(numberOfVictories: number, numberOfWaterloos: number): PlayerLevel {
    if (numberOfVictories >= ADMIRAL_MIN_VICTORIES) {
        return PlayerLevel.Admiral;
    }
    if (numberOfVictories >= CAPTAIN_MIN_VICTORIES) {
        return PlayerLevel.Captain;
    }
    if (numberOfVictories >= SEAMAN_MIN_VICTORIES) {
        return PlayerLevel.Seaman;
    }
    return PlayerLevel.Shipboy;
}
