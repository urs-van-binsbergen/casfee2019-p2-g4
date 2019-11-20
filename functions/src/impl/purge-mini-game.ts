import { CallableContext } from 'firebase-functions/lib/providers/https';
import COLL from '../public/collection-names';
import { authenticate } from '../shared/auth-utils';

/*
 * Remove all my game data (prep, waitingPlayers, battle)
 */
export default async function purgeMiniGame(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);

    // My docs
    const uid = authInfo.uid;

    return db.runTransaction(async tx => {

        const playerRef = db.collection(COLL.PLAYERS).doc(uid);
        const playerDoc = await tx.get(playerRef);

        const wPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(uid);
        const wPlayerDoc = await tx.get(wPlayerRef);

        // --- Do only WRITE after this point! ------------------------
        if (playerDoc.exists) {
            tx.delete(playerRef);
        }

        if (wPlayerDoc.exists) {
            tx.delete(wPlayerRef);
        }
    });
}

