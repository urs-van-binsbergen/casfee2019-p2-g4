import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { loadData } from './utils';

export default async function makeGuess(
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
    const currentGuess = parseInt(data.currentGuess);
    if (!currentGuess || currentGuess > 100 || currentGuess < 1) {
        throw new HttpsError('out-of-range', 'number from 1 to 100')
    }

    const uid = context.auth.uid;

    // (ich verzichte hier mal auf eine RW-Transaktion, obwohl es ws. sinnvoll wäre)

    const playerRef = db.collection('battlePlayers').doc(uid);
    const playerDoc = await playerRef.get();
    const playerData = loadData(playerDoc);

    if (!playerData.canShootNext) {
        throw 'player can not shoot now';
    }

    const opponentUid = playerData.opponentUid;
    const guesses = playerData.guesses || [];

    const opponentRef = db.collection('battlePlayers').doc(opponentUid);
    const opponentDoc = await opponentRef.get();
    const opponentData = loadData(opponentDoc);

    const sign = Math.sign(currentGuess - opponentData.miniGameNumber);
    let guessInfo: string;
    let currentStateInfo = null;
    let opponentStateInfo = null;
    switch (sign) {
        case 0:
            guessInfo = 'perfect!';
            currentStateInfo = 'you win!';
            opponentStateInfo = 'you loose!';
            break;
        case -1:
            guessInfo = 'go higher';
            opponentStateInfo = `opponent's guess was ${currentGuess}. Muaha, too low!`;
            break;
        case 1:
            guessInfo = 'go lower';
            opponentStateInfo = `opponent's guess was ${currentGuess}. Hihi, too high!`;
            break;
        default:
            throw 'unexpected sign: ' + sign;
    }

    const newGuesses = [...guesses, { currentGuess, sign, guessInfo }];

    const batch = db.batch();
    batch.update(db.collection('battlePlayers').doc(uid), {
        guesses: newGuesses, currentStateInfo, canShootNext: false
    })
    batch.update(db.collection('battlePlayers').doc(opponentUid), {
        currentStateInfo: opponentStateInfo, canShootNext: sign !== 0
    })

    return batch.commit()
        .then(res => res)
        .catch(err => console.log(err));
}
