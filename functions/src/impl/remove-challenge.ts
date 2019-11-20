import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { getDataOrNull } from '../shared/db/db-utils';
import { WaitingPlayer } from '../public/core-models';
import COLL from '../public/collection-names';
import { authenticate } from '../shared/auth-utils';
import { RemoveChallengeArgs } from '../public/arguments';

export default function removeChallenge(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toRemoveChallengeArgs(data);
    const uid = authInfo.uid;
    const oppUid = args.opponentUid;

    // Refs
    const oppWPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(oppUid);

    return db.runTransaction(async tx => {
        const oppWPlayerDoc = await tx.get(oppWPlayerRef);
        const oppWPlayer = getDataOrNull<WaitingPlayer>(oppWPlayerDoc);

        if (oppWPlayer == null) {
            throw new HttpsError('not-found', 'opponent not found');
        }

        // --- Do only WRITE after this point! ------------------------

        tx.update(oppWPlayerRef, {
            challenges: oppWPlayer.challenges.filter(x => x.challengerInfo.uid !== uid)
        });

    });
}

/*
 * Convert from whatever the client sent to the required argument structure
 */
function toRemoveChallengeArgs(data: any): RemoveChallengeArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    return {
        opponentUid: (data.opponentUid || '').toString()
    };
}

