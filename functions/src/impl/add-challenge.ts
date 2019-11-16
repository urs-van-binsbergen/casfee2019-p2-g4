import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import * as uuid from 'uuid/v4';
import { getData } from '../shared/db-utils';
import { Challenge, WaitingPlayer, Player, User, PlayerStatus, Battle, PlayerInfo, Size } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';
import { authenticate } from '../shared/auth-utils';
import { AddChallengeArgs } from '../public/arguments';
import { areEqualSize as sizesAreEqual, createBoard, fleetsHaveEqualLengths } from '../public/core-methods';
import { DocumentReference } from '@google-cloud/firestore';

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

        // Get data
        const player = getData<Player>(playerDoc);
        const user = getData<User>(userDoc);
        const oppPlayer = getData<Player>(oppPlayerDoc);
        const oppUser = getData<User>(oppUserDoc);

        // Preconditions (player documents must exist and be in status 'Preparing')
        const allowedStatusses = [PlayerStatus.Waiting];
        if (!player || !allowedStatusses.includes(player.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `PlayerStatus '${player.playerStatus}' disallows this operation`);
        }
        if (!oppPlayer || !allowedStatusses.includes(oppPlayer.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `Opponent PlayerStatus '${oppPlayer.playerStatus}' disallows this operation`);
        }

        const waitingPlayers = await getWaitingPlayersData(db, tx, uid, oppUid);

        // Exception when waitingPlayer documents do not exist (data inconsistency!)
        if (waitingPlayers.wPlayer === null) {
            throw new HttpsError('failed-precondition', 'challenger not found in waiting players');
        }
        if (waitingPlayers.oppWPlayer === null) {
            throw new HttpsError('failed-precondition', 'challenged player not found in waiting players');
        }

        // Exception when challenge does already exist
        const challengesByMe = waitingPlayers.challengeMap.filter(x => x.challengerUid === uid);
        if (challengesByMe.find(x => x.challengeTarget.uid === oppUid)) {
            throw new HttpsError('failed-precondition', 'challenge already exists');
        }

        const challengesByOpp = waitingPlayers.challengeMap.filter(x => x.challengerUid === oppUid);
        const isMatch = !!challengesByOpp.find(x => x.challengeTarget.uid === uid);
        const now = new Date();

        // --- Do only WRITE after this point! ------------------------

        if (isMatch) {
            // Check boards are of the same size
            if (!sizesAreEqual(player.board.size, oppPlayer.board.size)) {
                throw new HttpsError('failed-precondition', 'Board sizes do not match');
            }
            // Check ships are of the same length
            if (!fleetsHaveEqualLengths(player.board.ships, oppPlayer.board.ships)) {
                throw new HttpsError('failed-precondition', 'Ship lengths do not match');
            }

            // Before battle starts: remove all challenges at 3rd party players
            removePassiveChallenges(waitingPlayers.challengeMap, tx, [uid, oppUid]);

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
                challenges: [...waitingPlayers.oppWPlayer.challenges, newChallenge]
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

interface WaitingPlayersData {
    wPlayer: WaitingPlayer | null;
    oppWPlayer: WaitingPlayer | null;
    challengeMap: ChallengeMapEntry[];
}

interface ChallengeMapEntry {
    challengeTargetRef: DocumentReference;
    challengerUid: string;
    challengeTarget: WaitingPlayer;
}

async function getWaitingPlayersData(
    db: FirebaseFirestore.Firestore,
    tx: FirebaseFirestore.Transaction,
    uid: string, oppUid: string
): Promise<WaitingPlayersData> {
    const wPlayerCollRef = db.collection(COLL.WAITING_PLAYERS);

    const data: WaitingPlayersData = {
        wPlayer: null,
        oppWPlayer: null,
        challengeMap: []
    };

    await tx.get(wPlayerCollRef).then(snapshot => {
        snapshot.forEach(doc => {
            const wPlayer = getData<WaitingPlayer>(doc);
            if (wPlayer.uid === uid) {
                data.wPlayer = wPlayer;
            } else if (wPlayer.uid === oppUid) {
                data.oppWPlayer = wPlayer;
            }
            for (const challenge of wPlayer.challenges) {
                data.challengeMap.push({
                    challengeTargetRef: doc.ref,
                    challengeTarget: wPlayer,
                    challengerUid: challenge.challengerInfo.uid
                });
            }
        });
    });

    return data;
}

function removePassiveChallenges(
    challengeMap: ChallengeMapEntry[],
    tx: FirebaseFirestore.Transaction,
    challengerUids: string[]
) {
    const challengeTargets: { ref: DocumentReference, challengeTarget: WaitingPlayer }[] = [];
    for (const m of challengeMap.filter(x => challengerUids.includes(x.challengerUid))) {
        challengeTargets.push({
            ref: m.challengeTargetRef,
            challengeTarget: m.challengeTarget
        });
    }

    for (const t of challengeTargets) {
        // Do not alter challenger's entry (will typically be delete anyway)
        if (challengerUids.includes(t.challengeTarget.uid)) {
            continue;
        }
        tx.update(t.ref, {
            challenges: t.challengeTarget.challenges.filter(
                x => !challengerUids.includes(x.challengerInfo.uid)
            )
        });
    }
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
