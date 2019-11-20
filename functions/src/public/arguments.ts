import { Ship } from './core-models';
import { Size, Pos } from './geometry';

// Cloud function argument structures (shared with frontend)

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
