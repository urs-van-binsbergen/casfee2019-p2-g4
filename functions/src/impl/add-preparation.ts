import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';

export default function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore, 
) {
    if(!context.auth || !context.auth.uid) {
        throw new HttpsError('permission-denied', 'auth or uid missing'); // TODO
    }
    if(!data) {
        throw new HttpsError('invalid-argument', 'data missing') // TODO
    }
    var miniGameNumber = parseInt(data.miniGameNumber);
    if(!miniGameNumber || miniGameNumber > 100 || miniGameNumber < 1) {
        throw new HttpsError('out-of-range', 'number from 1 to 100') 
    }

    const uid = context.auth.uid;
    const name = context.auth.token.name || context.auth.token.email || uid;

    var batch = db.batch();
    batch.set(db.collection('preparations').doc(uid), {
        miniGameNumber
    })
    batch.set(db.collection('waitingPlayers').doc(uid), {
        name
    })

    return batch.commit()
        .then(res => res)
        .catch(err => console.log(err));
}
