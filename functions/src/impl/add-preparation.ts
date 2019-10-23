import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { Ship, Player, PlayerStatus, WaitingPlayer, PlayerInfo, User } from '../public/core-models';
import { PreparationArgs } from '../public/arguments';
import { authenticate } from '../shared/auth-utils';
import { toShip } from '../shared/model-converters';
import COLL from '../public/firestore-collection-name-const';
import { getData } from '../shared/db-utils';

export default async function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toPreparationArgs(data);

    const userDoc = await db.collection(COLL.USERS).doc(authInfo.uid).get();
    const user = getData<User>(userDoc);

    const player = createPlayer(user, args);
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

    // TEMP mini-game
    const miniGameNumber = data.miniGameNumber ? parseInt(data.miniGameNumber, 10) : 100;
    if (!miniGameNumber || miniGameNumber < 1 || miniGameNumber > 100) {
        throw new HttpsError('out-of-range', 'number from 1 to 100');
    }

    // ships
    let ships: Array<Ship>;
    try {
        const tmp = Array.from<Ship>(data.ships.map((x: any) => {
            return toShip(x);
        }));
        ships = tmp;
    } catch (error) {
        throw new HttpsError('invalid-argument', 'ships missing or of bad type');
    }

    return { miniGameNumber, ships };
}

function createPlayer(user: User, args: PreparationArgs): Player {
    return {
        uid: user.uid,
        playerStatus: PlayerStatus.Preparing,
        fields: [], // todo
        ships: args.ships,
        miniGameNumber: args.miniGameNumber, // TEMP
        miniGameGuesses: [], // TEMP
        opponent: null,
        canShootNext: false,
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
