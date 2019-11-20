import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import * as uuid from 'uuid/v4';
import { areEqualSize, Size } from '../public/geometry';
import { Challenge, Player, User, PlayerStatus, Battle, PlayerInfo, Ship } from '../public/core-models';
import COLL from '../public/collection-names';
import { AddChallengeArgs } from '../public/arguments';
import { createBoard } from '../public/board';
import { getData } from '../shared/db/db-utils';
import { getWaitingPlayersData, removePassiveChallenges } from '../shared/db/waiting-player';
import { authenticate } from '../shared/auth-utils';

export default function addChallenge(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toAddChallengeArgs(data);
    const uid = authInfo.uid;
    const oppUid = args.opponentUid;

    // Disallow self-challenge
    if (uid === oppUid) {
        throw new HttpsError('invalid-argument', 'can not challenge yourself');
    }

    // Refs
    const playerRef = db.collection(COLL.PLAYERS).doc(uid);
    const wPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(uid);
    const userRef = db.collection(COLL.USERS).doc(uid);
    const oppPlayerRef = db.collection(COLL.PLAYERS).doc(oppUid);
    const oppWPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(oppUid);
    const oppUserRef = db.collection(COLL.USERS).doc(oppUid);

    return db.runTransaction(async tx => {
        // Load docs in one query (except waiting player, which will be load in a coll query)
        const docs = await tx.getAll(
            playerRef,
            userRef,
            oppPlayerRef,
            oppUserRef
        );
        const playerDoc = docs[0];
        const userDoc = docs[1];
        const oppPlayerDoc = docs[2];
        const oppUserDoc = docs[3];

        // Get data (exception when one of these is missing - TODO: convert to HttpsError)
        const player = getData<Player>(playerDoc);
        const user = getData<User>(userDoc);
        const oppPlayer = getData<Player>(oppPlayerDoc);
        const oppUser = getData<User>(oppUserDoc);

        // Preconditions (player documents must exist and be in status 'Waiting')
        const allowedStatusses = [PlayerStatus.Waiting];
        if (!allowedStatusses.includes(player.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `PlayerStatus '${player.playerStatus}' disallows this operation`);
        }
        if (!allowedStatusses.includes(oppPlayer.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `Opponent PlayerStatus '${oppPlayer.playerStatus}' disallows this operation`);
        }

        // Get all waiting players
        const wData = await getWaitingPlayersData(db, tx, uid, oppUid);

        // Exception when waitingPlayer documents do not exist (data inconsistency!)
        if (wData.wPlayer === null) {
            throw new HttpsError('failed-precondition', 'challenger not found in waiting players');
        }
        if (wData.oppWPlayer === null) {
            throw new HttpsError('failed-precondition', 'challenged player not found in waiting players');
        }

        // Exception when challenge does already exist
        const challengesByMe = wData.challengeMap.filter(x => x.challengerUid === uid);
        if (challengesByMe.find(x => x.challengeTarget.uid === oppUid)) {
            throw new HttpsError('failed-precondition', 'challenge already exists');
        }

        const challengesByOpp = wData.challengeMap.filter(x => x.challengerUid === oppUid);
        const isMatch = !!challengesByOpp.find(x => x.challengeTarget.uid === uid);
        const now = new Date();

        // --- Do only WRITE after this point! ------------------------

        if (isMatch) {
            // Check boards are of the same size
            if (!areEqualSize(player.board.size, oppPlayer.board.size)) {
                throw new HttpsError('failed-precondition', 'Board sizes do not match');
            }
            // Check ships are of the same length
            if (!fleetsHaveEqualLengths(player.board.ships, oppPlayer.board.ships)) {
                throw new HttpsError('failed-precondition', 'Ship lengths do not match');
            }

            // Before battle starts: remove all challenges at 3rd party players
            removePassiveChallenges(wData.challengeMap, tx, [uid, oppUid]);

            // Start battle
            const battleId = uuid();
            tx.set(playerRef, createPlayerInBattle(player, oppUser, true, battleId));
            tx.set(oppPlayerRef, createPlayerInBattle(oppPlayer, user, false, battleId));
            tx.delete(wPlayerRef);
            tx.delete(oppWPlayerRef);
        } else {
            // Add challenge for opponent
            const newChallenge: Challenge = {
                challengerInfo: createPlayerInfo(user),
                challengeDate: now
            };
            tx.update(oppWPlayerRef, {
                challenges: [...wData.oppWPlayer.challenges, newChallenge]
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

function createBattle(user: User, size: Size, battleId: string): Battle {
    return {
        battleId,
        opponentInfo: createPlayerInfo(user),
        opponentLastMoveDate: new Date(),
        targetBoard: createBoard(size, []),
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

function fleetsHaveEqualLengths(fleet1: Ship[], fleet2: Ship[]): boolean {
    return JSON.stringify(fleet1.map(x => x.length).sort()) ===
        JSON.stringify(fleet2.map(x => x.length).sort());
}
