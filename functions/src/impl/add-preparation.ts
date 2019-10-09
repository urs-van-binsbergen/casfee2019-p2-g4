import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { PreparationArgs } from '../public/preparation';
import { authenticate, AuthInfo } from '../shared/auth-utils';
import { Ship, Player, PlayerStatus } from '../public/core-models';
import { toShip } from '../shared/model-converters';

export default function addPreparation(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toPreparationArgs(data);

    const player = getPlayer(authInfo, args);

    const batch = db.batch();
    batch.set(db.collection('players').doc(authInfo.uid), player);
    batch.set(db.collection('waitingPlayers').doc(authInfo.uid), {
        displayName: authInfo.displayName
    });

    return batch.commit()
        .catch(err => {
            console.log(err);
        });
}

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

    return {
        miniGameNumber,
        ships
    };
}

function getPlayer(authInfo: AuthInfo, args: PreparationArgs): Player {
    return {
        uid: authInfo.uid,
        playerStatus: PlayerStatus.Preparing,
        fields: [], // todo
        ships: args.ships,
        miniGameNumber: args.miniGameNumber,
        opponent: null
    };
}
