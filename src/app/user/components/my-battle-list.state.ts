import { Battle, HistoricBattle } from '@cloud-api/core-models';

export interface MyBattleListItem {
    won: boolean;
    opponentUid: string;
    endDate: Date;
}

export interface MyBattleListState {
    uid: string;
    isDataLoaded?: boolean;
    battles: MyBattleListItem[];
}

export function getInitialState(uid: string): MyBattleListState {
    return {
        uid,
        battles: []
    };
}

export function reduceFromData(state: MyBattleListState, battles: HistoricBattle[]): MyBattleListState {
    return {
        uid: state.uid,
        battles: battles.map(b => {
            const isMyVictory = b.winnerUid === state.uid;
            return {
                won: isMyVictory,
                opponentUid: isMyVictory ? b.loserUid : b.winnerUid,
                endDate: b.endDate
            };
        }),
        isDataLoaded: true
    };
}
