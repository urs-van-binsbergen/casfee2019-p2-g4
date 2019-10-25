import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import { getData } from '../shared/db-utils';
import COLL from '../public/firestore-collection-name-const';
import { Player, PlayerStatus, TargetFieldStatus } from '../public/core-models';
import { ShootArgs } from '../public/arguments';
import { toMiniGameNumber, toPos } from '../shared/argument-converters';
import { authenticate } from '../shared/auth-utils';
import { findShipByPos, findFieldByPos, findTargetFieldByPos } from '../public/core-methods';

export default async function shoot(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const args = toShootArgs(data);

    // My docs
    const uid = authInfo.uid;
    const playerRef = db.collection(COLL.PLAYERS).doc(uid);

    return db.runTransaction(async tx => {
        const playerDoc = await tx.get(playerRef);
        const player = getData<Player>(playerDoc);

        if (!player.battle) {
            throw new Error('player is not in a battle');
        }

        if (!player.canShootNext) {
            throw new Error('player can not shoot now');
        }

        // Opponent data
        const oppUid = player.battle.opponentInfo.uid;
        const oppPlayerRef = db.collection(COLL.PLAYERS).doc(oppUid);
        const oppPlayerDoc = await tx.get(oppPlayerRef);
        const oppPlayer = getData<Player>(oppPlayerDoc);

        // State to be patched-back to db

        let playerWins: boolean;

        const targetBoard = player.battle.targetBoard; // (will be updated in-place)
        const oppBoard = oppPlayer.board; // (will be update in-place)

        // TEMP mini game
        const miniGameGuess = args.miniGameGuess;
        let miniGameLastGuessSign = 0;
        let miniGameGuesses: number[] = [];

        // Calcs begin here:
        if (miniGameGuess > 0) {
            // TEMP mini game
            miniGameLastGuessSign = Math.sign(miniGameGuess - oppPlayer.miniGameSecret);
            playerWins = miniGameLastGuessSign === 0;
            miniGameGuesses = [...player.battle.miniGameGuesses, miniGameGuess];
        } else {
            const targetPos = args.targetPos;
            const targetField = findTargetFieldByPos(targetBoard.fields, targetPos);
            const oppField = findFieldByPos(oppBoard.fields, targetPos);
            const oppShipHit = findShipByPos(oppBoard.ships, targetPos);
            if (oppShipHit !== null) {
                // TODO: detect repeated shoot on same target field

                // player state:
                targetField.status = TargetFieldStatus.Hit;

                // opponent state:
                const ship = oppShipHit.ship;
                oppField.isHit = true;
                ship.hits.push(oppShipHit.fieldIndex);

                // sunk?
                if (ship.hits.length === ship.length) {
                    // player state:
                    targetBoard.sunkShips.push(ship);
                    // opponent state:
                    ship.isSunk = true;
                }
            } else {
                targetField.status = TargetFieldStatus.Miss;
            }


            playerWins = false; // TODO
        }

        const lastMoveDate = new Date();

        const playerPatch = {
            playerStatus: playerWins ? PlayerStatus.Victory : PlayerStatus.InBattle,
            canShootNext: false,
            lastMoveDate,

            battle: {
                targetBoard,
                // TEMP mini game
                miniGameLastGuessSign,
                miniGameGuesses
            }
        };
        const oppPlayerPatch = {
            playerStatus: playerWins ? PlayerStatus.Waterloo : PlayerStatus.InBattle,
            canShootNext: !playerWins,
            lastMoveDate,

            board: oppBoard,

            // TEMP mini game
            miniGameLastOpponentGuess: miniGameGuess
        };

        // --- Do only WRITE after this point! ------------------------

        // ...
        tx.set(db.collection(COLL.PLAYERS).doc(uid), playerPatch);
        tx.set(db.collection(COLL.PLAYERS).doc(oppUid), oppPlayerPatch);
    });
}

function toShootArgs(data: any): ShootArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    // target pos
    const targetPos = toPos(data.targetPos);

    // TEMP mini-game
    const miniGameGuess = toMiniGameNumber(data.miniGameGuess);

    return { targetPos, miniGameGuess };
}

