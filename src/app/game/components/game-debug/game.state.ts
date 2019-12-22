import { Player, PlayerStatus } from '@cloud-api/core-models';

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

export function updateWithPlayer(oldState: State, player: Player): State {
    const initialState = getInitialState();
    const playerStatus = player ? player.playerStatus : PlayerStatus.Preparing;
    switch (playerStatus) {
        case PlayerStatus.Preparing:
            return { ...initialState, showPreparation: true };
        case PlayerStatus.Waiting:
            return { ...initialState, showMatch: true };
        case PlayerStatus.InBattle:
            return { ...initialState, showBattle: true };
        case PlayerStatus.Victory:
            if (oldState.showBattle) { // (only show immediately after battle)
                return { ...initialState, showVictory: true };
            } else {
                return { ...initialState, showPreparation: true };
            }
        case PlayerStatus.Waterloo:
            if (oldState.showBattle) { // (only show immediately after battle)
                return { ...initialState, showWaterloo: true };
            } else {
                return { ...initialState, showPreparation: true };
            }
    }
}
