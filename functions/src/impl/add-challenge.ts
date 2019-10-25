import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import * as uuid from 'uuid/v4';
import { getData } from '../shared/db-utils';
import { Challenge, WaitingPlayer, Player, User, PlayerStatus, Battle, PlayerInfo, TargetBoard, TargetFieldStatus, Size } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';
import { authenticate } from '../shared/auth-utils';
import { AddChallengeArgs } from '../public/arguments';
import { areEqualSize as sizesAreEqual, createFields } from '../public/core-methods';

export default function addChallenge(
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
        const battleId = uuid();
        console.log(battleId);

        // Check boards are of the same size
        if (!sizesAreEqual(player.board.size, playerO.board.size)) {
            throw new HttpsError('failed-precondition', 'Board sizes do not match');
        }

        // --- Do only WRITE after this point! ------------------------

        if (isMatch) {
            // Start battle
            tx.set(db.collection(COLL.PLAYERS).doc(uid), createPlayerInBattle(player, userO, true, battleId));
            tx.set(db.collection(COLL.PLAYERS).doc(uidO), createPlayerInBattle(playerO, user, false, battleId));
            tx.delete(waitingPlayerRef);
            tx.delete(waitingPlayerORef);
            // TODO: remove references in challenges with other players!
        } else {
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

function createPlayerInBattle(
    player: Player, opponentUser: User,
    canShootNext: boolean, battleId: string
): Player {
    return {
        ...player,

        playerStatus: PlayerStatus.InBattle,
        battle: createBattle(opponentUser, player.board.size, battleId),
        canShootNext
    };
}

function createTargetBoard(size: Size): TargetBoard {
    const fields = createFields(size, pos => ({ pos, status: TargetFieldStatus.Unknown }));
    return {
        size: { ...size },
        fields,
        sunkShips: []
    };
}

function createBattle(user: User, size: Size, battleId: string): Battle {
    return {
        battleId,
        opponentInfo: createPlayerInfo(user),
        opponentLastMoveDate: new Date(),
        targetBoard: createTargetBoard(size),

        // TEMP
        miniGameGuesses: [],
        miniGameLastGuessSign: 0,
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
