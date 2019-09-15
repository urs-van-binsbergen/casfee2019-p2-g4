import { } from 'firebase-admin'
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as functions from 'firebase-functions';

export default function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore
) {
    if(!context.auth) {
        throw new functions.https.HttpsError('permission-denied', 'auth missing'); // TODO
    }
    if(!data) {
        throw new functions.https.HttpsError('invalid-argument', 'data missing') // TODO
    }
    var miniGameNumber = parseInt(data.miniGameNumber);
    if(!miniGameNumber || miniGameNumber > 100 || miniGameNumber < 1) {
        throw new functions.https.HttpsError('out-of-range', 'number from 1 to 100') 
    }

    const uid = context.auth.uid;

    var batch = db.batch();
    batch.set(db.collection('preparations').doc(uid), {
        miniGameNumber
    })
    batch.set(db.collection('waitingPlayers').doc(uid), {
        name: "Player 1" // todo: get the display name 
    })

    return batch.commit()
        .then(res => res)
        .catch(err => console.log(err));
}
