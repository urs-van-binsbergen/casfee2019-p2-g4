import { Player, PlayerStatus, Battle } from '../../public/core-models';
import COLL from '../../public/collection-names';
import { getData, getDataOrNull } from './db-utils';
import { HttpsError } from 'firebase-functions/lib/providers/https';

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
