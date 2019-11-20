import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';
import COLL from '../public/collection-names';
import { PlayerStatus, FieldStatus } from '../public/core-models';
import { ShootArgs } from '../public/arguments';
import * as FlatTable from '../public/flat-table';
import { toPos } from '../shared/argument-converters';
import { authenticate } from '../shared/auth-utils';
import { findShipByPos } from '../public/ship';
import { loadBattleData, prepareHistoryUpdate } from '../shared/db/battle';

export default async function shoot(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const args = toShootArgs(data);
    const authInfo = authenticate(context.auth);
    const uid = authInfo.uid;

    return db.runTransaction(async tx => {
        const { oppPlayer, battle } = await loadBattleData(db, tx, uid);
        const oppUid = oppPlayer.uid;

        let playerWins: boolean;

        const targetBoard = battle.targetBoard;
        const targetTable = { size: targetBoard.size, cells: targetBoard.fields };
        const oppBoard = oppPlayer.board;
        const oppTable = { size: oppBoard.size, cells: oppBoard.fields };

        // Calcs begin here:
        const targetPos = args.targetPos;
        const targetField = FlatTable.getCell(targetTable, targetPos);
        if (!targetField) {
            throw new HttpsError('invalid-argument', 'pos not found in target board of shooting player');
        }
        if (targetField.status !== FieldStatus.Unknown) {
            throw new HttpsError('failed-precondition', 'target field as already shot at');
        }
        const oppField = FlatTable.getCell(oppTable, targetPos);
        if (!oppField) {
            throw new HttpsError('invalid-argument', 'pos not found in board of opponent player');
        }
        const hit = findShipByPos(oppBoard.ships, targetPos);
        if (hit !== null) {
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

        const date = new Date();

        const playerUpdate = {
            playerStatus: playerWins ? PlayerStatus.Victory : PlayerStatus.InBattle,
            canShootNext: !playerWins && !!hit,
            lastMoveDate: date,

            battle
        };
        const oppPlayerUpdate = {
            playerStatus: playerWins ? PlayerStatus.Waterloo : PlayerStatus.InBattle,
            canShootNext: !playerWins && !hit,
            lastMoveDate: date,

            board: oppBoard,
        };

        // History
        const writeHistory = playerWins ?
            await prepareHistoryUpdate(db, tx, uid, oppUid, battle.battleId, date) :
            null;

        // --- Do only WRITE after this point! ------------------------

        tx.update(db.collection(COLL.PLAYERS).doc(uid), playerUpdate);
        tx.update(db.collection(COLL.PLAYERS).doc(oppUid), oppPlayerUpdate);

        if (writeHistory) {
            writeHistory();
        }
    });
}

function toShootArgs(data: any): ShootArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    const targetPos = toPos(data.targetPos);
    return { targetPos };
}
