import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';

/*
 * Remove all my game data (prep, waitingPlayers, battle)
 */
export default async function purgeMiniGame(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore, 
) {
    if(!context.auth || !context.auth.uid) {
        throw new HttpsError('permission-denied', 'auth or uid missing'); // TODO
    }

    const uid = context.auth.uid;

    // (ich verzichte hier mal auf eine RW-Transaktion, obwohl es ws. sinnvoll wäre)

    const playerRef = db.collection('battlePlayers').doc(uid);
    const playerDoc = await playerRef.get();

    let opponentRef: any = null;
    if(playerDoc.exists) {
        const playerData = playerDoc.data() || {};
        const opponentUid = playerData.opponentUid;
        opponentRef = db.collection('battlePlayers').doc(opponentUid);
    }

    var batch = db.batch()
        .delete(playerRef)
        .delete(db.collection('preparations').doc(uid))
        .delete(db.collection('waitingPlayers').doc(uid))
    ;

    if(opponentRef != null) {
        batch.delete(opponentRef);
    }

    // TODO: remove references in challenges with other players!

    return batch.commit()
        .then(res => res)
        .catch(err => console.log(err));
}
