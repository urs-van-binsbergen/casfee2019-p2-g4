import { Battle, HistoricBattle, HallEntry, PlayerInfo, PlayerLevel } from '@cloud-api/core-models';

export interface MyBattleListItem {
    wasMyVictory: boolean;
    opponentDisplayName: string;
    opponentLevel: string;
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

export function reduceFromData(
    state: MyBattleListState,
    battles: HistoricBattle[],
    hallEntries: HallEntry[]
): MyBattleListState {

    // Dictionary uid -> PlayerInfo
    const playerInfos = {};
    hallEntries.forEach(x => playerInfos[x.playerInfo.uid] = x.playerInfo);

    return {
        uid: state.uid,
        battles: battles.map(b => {
            const wasMyVictory = b.winnerUid === state.uid;
            const opponentUid = wasMyVictory ? b.loserUid : b.winnerUid;
            const oppInfo = playerInfos[opponentUid];
            return {
                wasMyVictory,
                opponentDisplayName: oppInfo.displayName,
                opponentLevel: PlayerLevel[oppInfo.level],
                endDate: b.endDate
            };
        }),
        isDataLoaded: true
    };
}
