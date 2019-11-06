import { FlatGrid, Field as CoreField, Player } from '@cloud-api/core-models';
import { Row, BattleField, BattleBoard } from './battle-models';
import { findFieldByPos } from '@cloud-api/core-methods';

function createRowsAndFields(grid: FlatGrid<CoreField>): Row[] {
    var rows: Row[] = [];
    const size = grid.size;
    for (let y = 0; y < size.h; y++) {
        const fields: BattleField[] = [];
        for (let x = 0; x < size.h; x++) {
            const pos = { x, y };
            const coreField = findFieldByPos(grid, pos);
            const field = new BattleField(coreField.pos, coreField.status);
            fields.push(field);
        }
        const row = new Row(fields);
        rows.push(row);
    }
    return rows;
}

export function createTargetBoard(player: Player): BattleBoard {
    const targetBoard = player.battle.targetBoard;
    const targetRows = createRowsAndFields(targetBoard);
    const canShoot = player.canShootNext;
    const battleBoard = new BattleBoard(targetRows, targetBoard.ships, canShoot);
    return battleBoard;
}

export function createOwnBoard(player: Player): BattleBoard {
    const ownBoard = player.board;
    const ownRows = createRowsAndFields(ownBoard);
    const battleBoard = new BattleBoard(ownRows, ownBoard.ships, false);
    return battleBoard;
}
 