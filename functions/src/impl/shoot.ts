import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';

import { authenticate } from '../shared/auth-utils';
import { getData, getDataOrNull } from '../shared/db-utils';

import COLL from '../public/firestore-collection-name-const';

import { Player, PlayerStatus, FieldStatus } from '../public/core-models';
import { findShipByPos, findFieldByPos } from '../public/core-methods';

import { ShootArgs } from '../public/arguments';
import { toMiniGameNumber, toPos } from '../shared/common-argument-converters';

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
        const battle = player.battle; // (as seen by the current player!)

        if (!battle) {
            throw new Error('player is not in a battle');
        }

        if (!player.canShootNext) {
            throw new Error('player can not shoot now');
        }

        // Opponent data
        const oppUid = battle.opponentInfo.uid;
        const oppPlayerRef = db.collection(COLL.PLAYERS).doc(oppUid);
        const oppPlayerDoc = await tx.get(oppPlayerRef);
        const oppPlayer = getDataOrNull<Player>(oppPlayerDoc);

        if (oppPlayer == null) {
            throw new Error('opponent does not exist in db');
        }

        if (oppPlayer.battle == null || oppPlayer.battle.battleId !== battle.battleId) {
            throw new Error('opponent is not in a battle with player');
            // (this is an inconsistency in data)
        }

        // State to be patched-back to db

        let playerWins: boolean;

        const targetBoard = battle.targetBoard;
        const oppBoard = oppPlayer.board;

        // TEMP mini game
        const miniGameGuess = args.miniGameGuess;

        // Calcs begin here:
        if (miniGameGuess > 0) {
            // TEMP mini game
            const sign = Math.sign(miniGameGuess - oppPlayer.miniGameSecret);
            playerWins = sign === 0;
            battle.miniGameLastGuessSign = sign;
            battle.miniGameGuesses = [...battle.miniGameGuesses, miniGameGuess];
        } else {
            const targetPos = args.targetPos;
            const targetField = findFieldByPos(targetBoard, targetPos);
            const oppField = findFieldByPos(oppBoard, targetPos);
            const hit = findShipByPos(oppBoard.ships, targetPos);
            if (hit !== null) {
                // TODO: detect repeated shoot on same target field

                oppField.status = FieldStatus.Hit;
                targetField.status = FieldStatus.Hit;

                const ship = hit.ship;
                ship.hits.push(hit.fieldIndex);
                if (ship.hits.length === ship.length) {
                    // sunk!
                    targetBoard.ships.push(ship);
                    ship.isSunk = true;
                }

                playerWins = oppBoard.ships.every(s => s.isSunk);
            } else {
                oppField.status = FieldStatus.Miss;
                targetField.status = FieldStatus.Miss;
                playerWins = false;
            }

        }

        const lastMoveDate = new Date();

        const playerUpdate = {
            playerStatus: playerWins ? PlayerStatus.Victory : PlayerStatus.InBattle,
            canShootNext: false,
            lastMoveDate,

            battle
        };
        const oppPlayerUpdate = {
            playerStatus: playerWins ? PlayerStatus.Waterloo : PlayerStatus.InBattle,
            canShootNext: !playerWins,
            lastMoveDate,

            board: oppBoard,

            // TEMP mini game
            miniGameLastOpponentGuess: miniGameGuess
        };

        // --- Do only WRITE after this point! ------------------------

        tx.update(db.collection(COLL.PLAYERS).doc(uid), playerUpdate);
        tx.update(db.collection(COLL.PLAYERS).doc(oppUid), oppPlayerUpdate);
    });
}

function toShootArgs(data: any): ShootArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    // target pos
    const targetPos = toPos(data.targetPos);

    // TEMP mini-game
    const miniGameGuess = data.miniGameGuess ? toMiniGameNumber(data.miniGameGuess) : 0;

    return { targetPos, miniGameGuess };
}
