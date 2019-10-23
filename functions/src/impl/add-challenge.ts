import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { getData } from '../shared/db-utils';
import { Challenge, WaitingPlayer, Player, User, PlayerStatus, Opponent, PlayerInfo } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';
import { authenticate } from '../shared/auth-utils';
import { AddChallengeArgs } from '../public/arguments';

export default function addChallengeImpl(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toAddChallengeArgs(data);

    // My docs
    const uid = authInfo.uid;
    const waitingPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(uid);
    const playerRef = db.collection(COLL.PLAYERS).doc(uid);
    const userRef = db.collection(COLL.USERS).doc(uid);

    // Opponent docs
    const uidO = args.opponentUid;
    const waitingPlayerORef = db.collection(COLL.WAITING_PLAYERS).doc(uidO);
    const playerORef = db.collection(COLL.PLAYERS).doc(uidO);
    const userORef = db.collection(COLL.USERS).doc(uidO);

    return db.runTransaction(async tx => {
        // Read docs
        const docs = await tx.getAll(
            waitingPlayerRef, 
            playerRef, 
            userRef,
            waitingPlayerORef, 
            playerORef,
            userORef
        );
        const waitingPlayerDoc = docs[0];
        const playerDoc = docs[1];
        const userDoc = docs[2];
        const waitingPlayerODoc = docs[3];
        const playerODoc = docs[4];
        const userODoc = docs[5];

        // My data
        const waitingPlayer = getData<WaitingPlayer>(waitingPlayerDoc);
        const player = getData<Player>(playerDoc);
        const user = getData<User>(userDoc);

        // Opponent data
        const waitingPlayerO = getData<WaitingPlayer>(waitingPlayerODoc);
        const playerO = getData<Player>(playerODoc);
        const userO = getData<User>(userODoc);

        const challenges: Challenge[] = waitingPlayer.challenges || [];
        const challengesO: Challenge[] = waitingPlayerO.challenges || [];

        // Ignore call when challenge already was created before
        if (challengesO.find(x => x.challengerInfo.uid === uid)) {
            return;
        }

        const isMatch = !!challenges.find(x => x.challengerInfo.uid === uidO);
        const now = new Date();

        // (Do only write after this point!)

        if (isMatch) {
            // Start battle
            tx.set(db.collection(COLL.PLAYERS).doc(uid), createPlayerInBattle(player, userO, true));
            tx.set(db.collection(COLL.PLAYERS).doc(uidO), createPlayerInBattle(playerO, user, false));
            tx.delete(waitingPlayerRef);
            tx.delete(waitingPlayerORef);
            // TODO: remove references in challenges with other players!
        }
        else {
            // Add challenge for opponent
            const newChallenge: Challenge = {
                challengerInfo: createPlayerInfo(user),
                challengeDate: now
            };
            tx.update(waitingPlayerORef, {
                challenges: [...challengesO, newChallenge]
            });
        }
    });
}

/*
 * Convert from whatever the client sent to the required argument structure
 */
function toAddChallengeArgs(data: any): AddChallengeArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    return {
        opponentUid: (data.opponentUid || '').toString()
    };
}

function createPlayerInBattle(player: Player, opponentUser: User, canShootNext: boolean): Player {
    return {
        uid: player.uid,
        playerStatus: PlayerStatus.Playing,
        fields: player.fields,
        ships: player.ships,
        miniGameNumber: player.miniGameNumber, // TEMP
        miniGameGuesses: [], // TEMP
        opponent: createOpponent(opponentUser),
        canShootNext
    };
}

function createOpponent(user: User): Opponent {
    return {
        battleId: '1', // TODO
        playerInfo: createPlayerInfo(user),
        fields: [], // TODO
        sunkShips: [],
        countdownDate: new Date()
    };
}

function createPlayerInfo(user: User): PlayerInfo {
    return {
        uid: user.uid,
        displayName: user.displayName,
        avatarFileName: user.avatarFileName,
        level: user.level
    };
}