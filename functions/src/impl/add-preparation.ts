import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { Player, PlayerStatus, WaitingPlayer, User, Board } from '../public/core-models';
import { PreparationArgs } from '../public/arguments';
import COLL from '../public/collection-names';
import { createBoard } from '../public/board';
import { authenticate } from '../shared/auth-utils';
import { toShip, toSize, convertArray } from '../shared/argument-converters';
import { getData, getDataOrNull } from '../shared/db/db-utils';
import { validateShipLayout } from '../public/ship';
import { createPlayerInfo } from '../public/player-info';

export default async function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toPreparationArgs(data);
    const board = createBoard(args.size, args.ships);

    validateShipLayout(board.size, board.ships);

    return db.runTransaction(async tx => {
        const userRef = db.collection(COLL.USERS).doc(authInfo.uid);
        const playerRef = db.collection(COLL.PLAYERS).doc(authInfo.uid);
        const wPlayerRef = db.collection(COLL.WAITING_PLAYERS).doc(authInfo.uid);

        // Preconditions
        const allowedStatusses = [PlayerStatus.Preparing, PlayerStatus.Victory, PlayerStatus.Waterloo];
        const existingPlayer = getDataOrNull<Player>(await playerRef.get());
        if (existingPlayer && !allowedStatusses.includes(existingPlayer.playerStatus)) {
            throw new HttpsError('failed-precondition',
                `PlayerStatus '${existingPlayer.playerStatus}' disallows this operation`);
        }

        const userDoc = await userRef.get();
        const user = getData<User>(userDoc);

        const player = createPlayer(user, board);
        const wPlayer = createWaitingPlayer(user);

        // --- Do only WRITE after this point! ------------------------

        tx.set(playerRef, player);
        tx.set(wPlayerRef, wPlayer);
    });
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


