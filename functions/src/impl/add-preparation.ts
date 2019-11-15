import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { Player, PlayerStatus, WaitingPlayer, PlayerInfo, User, Board } from '../public/core-models';
import { PreparationArgs } from '../public/arguments';
import { authenticate } from '../shared/auth-utils';
import { toShip, toSize, convertArray } from '../shared/common-argument-converters';
import COLL from '../public/firestore-collection-name-const';
import { getData } from '../shared/db-utils';
import { createBoard, isValidBoard } from '../public/core-methods';

export default async function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toPreparationArgs(data);
    const board = createBoard(args.size, args.ships);
    validateBoard(board);

    const userDoc = await db.collection(COLL.USERS).doc(authInfo.uid).get();
    const user = getData<User>(userDoc);

    const player = createPlayer(user, board);
    const waitingPlayer = createWaitingPlayer(user);

    const batch = db.batch();
    batch.set(db.collection(COLL.PLAYERS).doc(authInfo.uid), player);
    batch.set(db.collection(COLL.WAITING_PLAYERS).doc(authInfo.uid), waitingPlayer);

    return batch.commit();
}

/*
 * Convert from whatever the client sent to the required argument structure
 */
function toPreparationArgs(data: any): PreparationArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    // size
    const size = toSize(data.size);

    // ships
    const ships = convertArray(data.ships,
        el => toShip(el),
        () => new HttpsError('invalid-argument', 'ships missing or of bad type')
    );

    return { size, ships };
}

function validateBoard(board: Board): void {
    if (!isValidBoard(board)) {
        throw new HttpsError('invalid-argument', 'board is not valid');
    }
}

function createPlayer(user: User, board: Board): Player {

    return {
        uid: user.uid,
        playerStatus: PlayerStatus.Waiting,

        board,

        battle: null,
        canShootNext: false,
        lastMoveDate: new Date(),
    };
}

function createWaitingPlayer(user: User): WaitingPlayer {
    return {
        uid: user.uid,
        playerInfo: createPlayerInfo(user),
        challenges: []
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
