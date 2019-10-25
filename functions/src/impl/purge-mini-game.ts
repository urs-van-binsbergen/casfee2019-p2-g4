import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { PlayerStatus, Player } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';

/*
 * Remove all my game data (prep, waitingPlayers, battle)
 */
export default async function purgeMiniGame(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    if (!context.auth || !context.auth.uid) {
        throw new HttpsError('permission-denied', 'auth or uid missing'); // TODO
    }

    const uid = context.auth.uid;

    // (ich verzichte hier mal auf eine RW-Transaktion, obwohl es ws. sinnvoll wäre)

    const playerRef = db.collection(COLL.PLAYERS).doc(uid);
    const playerDoc = await playerRef.get();

    let opponentRef: any = null;
    if (playerDoc.exists) {
        const playerData = playerDoc.data() as Player;
        if (playerData && playerData.battle) {
            const opponentUid = playerData.battle.opponentInfo.uid;
            opponentRef = db.collection(COLL.PLAYERS).doc(opponentUid);
        }
    }

    const batch = db.batch()
        .delete(playerRef)
        .delete(db.collection(COLL.WAITING_PLAYERS).doc(uid))
        ;

    if (opponentRef != null) {
        batch.update(opponentRef, { opponent: null, status: PlayerStatus.Waiting });
    }

    // TODO: remove references in challenges with other players!

    return batch.commit()
        .catch(err => {
            console.log(err);
        });
}
