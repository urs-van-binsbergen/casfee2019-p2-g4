import { PlayerStatus } from '@cloud-api/core-models';
import { PlayerModel as PlayerStateModel } from '../../state/player.state';

export interface GameModel {
    showPreparation?: boolean;
    showMatch?: boolean;
    showBattle?: boolean;
    showVictory?: boolean;
    showWaterloo?: boolean;
    loading?: boolean;
    unauthenticated?: boolean;
}

export function getGameModel(prevModel: GameModel, playerState: PlayerStateModel): GameModel {
    if (!playerState || playerState.loading) {
        return { loading: true };
    }
    if (playerState.unauthenticated) {
        return { unauthenticated: true };
    }
    const player = playerState.player;
    const playerStatus = player ? player.playerStatus : PlayerStatus.Preparing;
    switch (playerStatus) {
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
