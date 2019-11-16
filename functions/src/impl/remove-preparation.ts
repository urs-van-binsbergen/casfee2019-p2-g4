import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { getDataOrNull } from '../shared/db-utils';
import { Player, PlayerStatus } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';
import { authenticate } from '../shared/auth-utils';
import { getWaitingPlayersData, removePassiveChallenges } from '../public/waiting-players';

export default function removePreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const uid = authInfo.uid;

    // Refs
    const playerRef = db.collection(COLL.PLAYERS).doc(uid);
    const wPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(uid);

    return db.runTransaction(async tx => {
        const player = getDataOrNull<Player>(await tx.get(playerRef));

        // Preconditions (player documents must exist and be in status 'Waiting')
        const allowedStatusses = [PlayerStatus.Waiting];
        if (player && !allowedStatusses.includes(player.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `PlayerStatus '${player.playerStatus}' disallows this operation`);
        }

        // Get all waiting players
        const wData = await getWaitingPlayersData(db, tx, uid, null);

        // --- Do only WRITE after this point! ------------------------

        // Remove all challenges at 3rd party players
        removePassiveChallenges(wData.challengeMap, tx, [uid]);

        // Delete
        if (player) {
            tx.delete(playerRef);
        }
        if (wData.wPlayer) {
            tx.delete(wPlayerRef);
        }

    });
}
