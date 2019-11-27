import { Player, Board, Ship, FieldStatus, PlayerStatus } from '@cloud-api/core-models';

export interface State {
    showPreparation: boolean;
    showMatch: boolean;
    showBattle: boolean;
    showVictory: boolean;
    showWaterloo: boolean;
}

export function getInitialState(): State {
    return {
        showPreparation: false,
        showMatch: false,
        showBattle: false,
        showVictory: false,
        showWaterloo: false
    };
}

export function reduceWithPlayer(state: State, player: Player): State {
    var state0 = getInitialState();
    const playerStatus = player ? player.playerStatus : PlayerStatus.Preparing;
    switch (playerStatus) {
        case PlayerStatus.Preparing:
            return { ...state0, showPreparation: true };
        case PlayerStatus.Waiting:
            return { ...state0, showMatch: true };
        case PlayerStatus.InBattle:
            return { ...state0, showBattle: true };
        case PlayerStatus.Victory:
            if (state.showBattle) { // (only show immediately after battle)
                return { ...state0, showVictory: true };
            }
            else {
                return { ...state0, showPreparation: true };
            }
        case PlayerStatus.Waterloo:
            if (state.showBattle) { // (only show immediately after battle)
                return { ...state0, showWaterloo: true };
            }
            else {
                return { ...state0, showPreparation: true };
            }
    }
}
