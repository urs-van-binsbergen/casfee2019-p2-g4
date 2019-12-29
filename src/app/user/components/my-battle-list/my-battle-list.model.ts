import { HistoricBattle, HallEntry, PlayerLevel, PlayerInfo } from '@cloud-api/core-models';

export interface BattleListItem {
    wasMyVictory: boolean;
    opponentDisplayName: string;
    opponentLevel: string;
    endDate: Date;
}

export interface BattleListModel {
    battles: BattleListItem[];
    isLoadingDone?: boolean;
    isLoadFailure?: boolean;
}

export function getBattleListModel(
    uid: string,
    battles: HistoricBattle[],
    hallEntries: HallEntry[],
): BattleListModel {

    // Dictionary uid -> PlayerInfo
    const playerInfos = {};
    hallEntries.forEach(x => playerInfos[x.playerInfo.uid] = x.playerInfo);

    return {
        battles: battles.map(b => {
            const wasMyVictory = b.winnerUid === uid;
            const opponentUid = wasMyVictory ? b.loserUid : b.winnerUid;
            const opponentInfo: PlayerInfo = playerInfos[opponentUid];
            const opponentDisplayName = opponentInfo ? opponentInfo.displayName : '(deleted)';
            const opponentLevel = opponentInfo ? PlayerLevel[opponentInfo.level] : '-';
            return {
                wasMyVictory,
                opponentDisplayName,
                opponentLevel,
                endDate: b.endDate
            };
        }),
        isLoadingDone: true,
        isLoadFailure: undefined
    };
}
