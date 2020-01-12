import { Player, PlayerStatus } from '@cloud-api/core-models';

export interface GameStatus {
    showPreparation?: boolean;
    showMatch?: boolean;
    showBattle?: boolean;
    showVictory?: boolean;
    showWaterloo?: boolean;
    loading?: boolean;
    unauthenticated?: boolean;
}

export function updateStatus(prevModel: GameStatus, loading: boolean, unauthenticated: boolean, player: Player): GameStatus {
    if (loading) {
        return { loading: true };
    }
    if (unauthenticated) {
        return { unauthenticated: true };
    }
    if (!player) {
        return { showPreparation: true };
    }
    switch (player.playerStatus) {
        case PlayerStatus.Preparing:
            return { showPreparation: true };
        case PlayerStatus.Waiting:
            return { showMatch: true };
        case PlayerStatus.InBattle:
            return { showBattle: true };
        case PlayerStatus.Victory:
            if (prevModel.showBattle) { // (only show immediately after battle)
                return { showVictory: true };
            } else {
                return { showPreparation: true };
            }
        case PlayerStatus.Waterloo:
            if (prevModel.showBattle) { // (only show immediately after battle)
                return { showWaterloo: true };
            } else {
                return { showPreparation: true };
            }
    }
}

export function applyRestart(prevModel: GameStatus): GameStatus {
    // Local status (entity state unchanged)
    if (prevModel.showVictory || prevModel.showWaterloo) {
        return {
            ...prevModel,
            showVictory: undefined,
            showWaterloo: undefined,
            showPreparation: true
        };
    }
    return prevModel;
}
