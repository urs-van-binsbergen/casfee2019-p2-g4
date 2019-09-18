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

    var waitingPlayerRef = db.collection('waitingPlayers').doc(uid);
    var prepRef = db.collection('preparations').doc(uid);
    var waitingPlayerRefO = db.collection('waitingPlayers').doc(opponentUid);
    var prepRefO = db.collection('preparations').doc(opponentUid);

    return db.runTransaction(tx => {
        return tx.getAll(waitingPlayerRef, prepRef, waitingPlayerRefO, prepRefO)
        .then(docs => {
            const now = Date();

            const waitingPlayerData = loadData(docs[0]);
            const challenges: Challenge[] = waitingPlayerData.challenges || [];
            const prepData = loadData(docs[1])

            const waitingPlayerDataO = loadData(docs[2]);
            const challengesO: Challenge[] = waitingPlayerDataO.challenges || [];
            const prepDataO = loadData(docs[3])

            if (challengesO.find(x => x.uid == uid)) {
                throw 'challenge already exists';
            }

            if (challenges.find(x => x.uid == opponentUid)) {
                // MATCH! -> start the battle
                // (always do all reads before any writes)

                tx.set(db.collection('battlePlayers').doc(uid), {
                    opponentUid,
                    startDate: now,
                    miniGameNumber: prepData.miniGameNumber,
                    guesses: [], 
                    currentStateInfo: null,
                    canShootNext: true
                });
                tx.set(db.collection('battlePlayers').doc(opponentUid), {
                    opponentUid: uid,
                    startDate: now,
                    miniGameNumber: prepDataO.miniGameNumber,
                    guesses: [], 
                    currentStateInfo: null,
                    canShootNext: false
                });
                tx.delete(waitingPlayerRef)
                    .delete(waitingPlayerRefO)
                    .delete(prepRef)
                    .delete(prepRefO);
            // TODO: remove references in challenges with other players!
            }
            else {
                const challenges = [...challengesO, { uid, name, challengeDate: now }];
                tx.update(waitingPlayerRefO, { challenges });
            }
        });
    }).then(() => {
        console.log("Transaction successfully committed!");
    }).catch(error => {
        console.log("Transaction failed: ", error);
    });
}