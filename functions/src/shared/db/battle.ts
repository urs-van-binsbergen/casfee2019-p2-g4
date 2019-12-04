import { Player, PlayerStatus, Battle, HistoricBattle, HallEntry, PlayerInfo, User } from '../../public/core-models';
import COLL from '../../public/collection-names';
import { getData, getDataOrNull } from './db-utils';
import { HttpsError } from 'firebase-functions/lib/providers/https';
import { createPlayerInfo } from '../../public/player-info';
import { getPlayerLevel } from '../../public/hall';

export async function loadBattleData(
    db: FirebaseFirestore.Firestore,
    tx: FirebaseFirestore.Transaction,
    uid: string
): Promise<{
    player: Player,
    oppPlayer: Player,
    battle: Battle
}> {
    const playerRef = db.collection(COLL.PLAYERS).doc(uid);

    // Load player data
    const playerDoc = await tx.get(playerRef);
    const player = getData<Player>(playerDoc);
    const battle = player.battle; // (as seen by the current player!)

    // Preconditions
    if (player.playerStatus !== PlayerStatus.InBattle) {
        throw new HttpsError('failed-precondition',
            `PlayerStatus '${player.playerStatus}' disallows this operation`);
    }

    // Data consistency check
    if (!battle) {
        throw new HttpsError('failed-precondition', 'battle data not found');
    }

    // Load opponent data
    const oppUid = battle.opponentInfo.uid;
    const oppPlayerRef = db.collection(COLL.PLAYERS).doc(oppUid);
    const oppPlayerDoc = await tx.get(oppPlayerRef);
    const oppPlayer = getDataOrNull<Player>(oppPlayerDoc);

    // Data consistency check opponent
    if (oppPlayer == null) {
        throw new HttpsError('internal', 'opponent does not exist in db');
    }
    if (oppPlayer.battle == null || oppPlayer.battle.battleId !== battle.battleId) {
        throw new HttpsError('internal', 'opponent is not in a battle with player');
    }

    return { player, oppPlayer, battle };
}

export async function prepareHistoryUpdate(
    db: FirebaseFirestore.Firestore,
    tx: FirebaseFirestore.Transaction,
    winnerUid: string,
    loserUid: string,
    battleId: string,
    date: Date
): Promise<() => void> {
    const winnerHallRef = db.collection(COLL.HALL_ENTRIES).doc(winnerUid);
    const winnerUserRef = db.collection(COLL.USERS).doc(winnerUid);
    const loserHallRef = db.collection(COLL.HALL_ENTRIES).doc(loserUid);
    const loserUserRef = db.collection(COLL.USERS).doc(loserUid);
    const historicBattleRef = db.collection(COLL.HISTORIC_BATTLES).doc(battleId);

    const docs = await tx.getAll(winnerHallRef, winnerUserRef, loserHallRef, loserUserRef);
    let i = 0;
    const winnerEntry = getDataOrNull<HallEntry>(docs[i++]);
    const winnerUser = getData<User>(docs[i++]);
    const loserEntry = getDataOrNull<HallEntry>(docs[i++]);
    const loserUser = getData<User>(docs[i++]);

    const winnerPlayerInfo = createPlayerInfo(winnerUser);
    const newWinnerEntry = getNewHallEntryState(winnerPlayerInfo, winnerEntry, true);

    const loserPlayerInfo = createPlayerInfo(loserUser);
    const newLoserEntry = getNewHallEntryState(loserPlayerInfo, loserEntry, false);

    const historicBattle: HistoricBattle = {
        battleId,
        endDate: date,
        loserUid: winnerUid,
        winnerUid: loserUid,
        uids: [winnerUid, loserUid]
    };

    return () => {
        tx.create(historicBattleRef, historicBattle);

        tx.set(winnerHallRef, newWinnerEntry);
        tx.set(loserHallRef, newLoserEntry);

        tx.update(winnerUserRef, { level: newWinnerEntry.playerInfo.level });
        tx.update(loserUserRef, { level: newLoserEntry.playerInfo.level });
    };
}

function getNewHallEntryState(
    playerInfo: PlayerInfo,
    oldHallEntry: HallEntry | null,
    isWinner: boolean
): HallEntry {
    const numberOfVictories = (oldHallEntry ? oldHallEntry.numberOfVictories : 0) + (isWinner ? 1 : 0);
    const numberOfWaterloos = (oldHallEntry ? oldHallEntry.numberOfWaterloos : 0) + (isWinner ? 0 : 1);
    const level = getPlayerLevel(numberOfVictories, numberOfWaterloos);
    const newHallEntry = {
        numberOfVictories,
        numberOfWaterloos,
        playerInfo: { ...playerInfo, level }
    };
    return newHallEntry;
}
