import { CallableContext, HttpsError } from "firebase-functions/lib/providers/https";
import { loadData, Challenge } from './utils';



export default function addChallengeImpl(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    if (!context.auth || !context.auth.uid) {
        throw new HttpsError('permission-denied', 'auth or uid missing'); // TODO
    }
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing') // TODO
    }
    var opponentUid = data.opponentUid;
    if (!opponentUid) {
        throw new HttpsError('out-of-range', 'number from 1 to 100')
    }

    const uid = context.auth.uid;
    const name = context.auth.token.name || context.auth.token.email || uid;

    var playerRef = db.collection("waitingPlayers").doc(uid);
    var opponentRef = db.collection("waitingPlayers").doc(opponentUid);

    return db.runTransaction(tx => {
        return tx.getAll(playerRef, opponentRef).then(docs => {
            const playerData = loadData(docs[0]);
            const opponentData = loadData(docs[1]);
            const playerChallenges: Challenge[] = playerData.challenges || [];
            const opponentChallenges: Challenge[] = opponentData.challenges || [];

            if (playerChallenges.find(x => x.uid == opponentUid)) {
                // MATCH :) 
                tx.update(playerRef, { isMatch: true });
                tx.update(opponentRef, { isMatch: true });
                // TODO: must start the battle
            }

            if (!opponentChallenges.find(x => x.uid == uid)) {
                const challenges = [...opponentChallenges, { uid, name, challengeDate: Date() }];
                tx.update(opponentRef, { challenges });
            }
        });
    }).then(() => {
        console.log("Transaction successfully committed!");
    }).catch(error => {
        console.log("Transaction failed: ", error);
    });
}