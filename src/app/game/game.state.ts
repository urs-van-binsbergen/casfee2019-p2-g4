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
    var state = getInitialState();
    const playerStatus = player ? player.playerStatus : PlayerStatus.Preparing;
    switch (playerStatus) {
        case PlayerStatus.Preparing:
            return { ...state, showPreparation: true };
        case PlayerStatus.Waiting:
            return { ...state, showMatch: true };
        case PlayerStatus.InBattle:
            return { ...state, showBattle: true };
        case PlayerStatus.Victory:
            return { ...state, showVictory: true };
        case PlayerStatus.Waterloo:
            return { ...state, showWaterloo: true };
    }
}
