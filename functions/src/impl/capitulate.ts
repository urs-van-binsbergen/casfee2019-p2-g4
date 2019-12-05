import { CallableContext } from 'firebase-functions/lib/providers/https';
import COLL from '../public/collection-names';
import { PlayerStatus } from '../public/core-models';
import { authenticate } from '../shared/auth-utils';
import { loadBattleData, prepareHistoryUpdate } from '../shared/db/battle';

export default async function capitulate(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const uid = authInfo.uid;

    return db.runTransaction(async tx => {
        const { oppPlayer, battle } = await loadBattleData(db, tx, uid);
        const oppUid = oppPlayer.uid;
        const date = new Date();

        // Player updates
        const playerUpdate = {
            playerStatus: PlayerStatus.Waterloo,
            canShootNext: false
        };
        const oppPlayerUpdate = {
            playerStatus: PlayerStatus.Victory,
            canShootNext: false
        };

        const winnerUid = oppUid;
        const loserUid = uid;

        // History
        const writeHistory = await prepareHistoryUpdate(db, tx, winnerUid, loserUid, battle.battleId, date);

        // --- Do only WRITE after this point! ------------------------

        tx.update(db.collection(COLL.PLAYERS).doc(uid), playerUpdate);
        tx.update(db.collection(COLL.PLAYERS).doc(oppUid), oppPlayerUpdate);

        writeHistory();
    });
}
