import { CallableContext } from 'firebase-functions/lib/providers/https';
import COLL from '../public/collection-names';
import { PlayerStatus } from '../public/core-models';
import { authenticate } from '../shared/auth-utils';
import { loadBattleData } from '../shared/db/battle';

export default async function capitulate(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const uid = authInfo.uid;

    return db.runTransaction(async tx => {
        const { oppPlayer } = await loadBattleData(db, tx, uid);
        const oppUid = oppPlayer.uid;

        // State to be patched-back to db
        const playerUpdate = {
            playerStatus: PlayerStatus.Waterloo,
            canShootNext: false
        };
        const oppPlayerUpdate = {
            playerStatus: PlayerStatus.Victory,
            canShootNext: false
        };

        // --- Do only WRITE after this point! ------------------------

        tx.update(db.collection(COLL.PLAYERS).doc(uid), playerUpdate);
        tx.update(db.collection(COLL.PLAYERS).doc(oppUid), oppPlayerUpdate);
    });
}
