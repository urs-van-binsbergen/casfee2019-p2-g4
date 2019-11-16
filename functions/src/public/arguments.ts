// Argument structure of cloud funcxtions (used server AND client side)

import { Ship, Size, Pos } from './core-models';

export interface UpdateUserArgs {
    displayName: string | null;
    avatarFileName: string | null;
    email: string | null;
}

export interface PreparationArgs {
    size: Size;
    ships: Ship[];
}

export interface AddChallengeArgs {
    opponentUid: string;
}

export interface RemoveChallengeArgs {
    opponentUid: string;
}

export interface ShootArgs {
    targetPos: Pos;
}
