import { Player, Board } from '@cloud-api/core-models';
import * as FlatTable from '@cloud-api/flat-table';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';

function createRowsAndFields(board: Board): Row[] {
    const table = { size: board.size, cells: board.fields };

    const rows: Row[] = [];
    const size = table.size;
    for (let y = 0; y < size.h; y++) {
        const fields: BattleField[] = [];
        for (let x = 0; x < size.h; x++) {
            const pos = { x, y };
            const field =  FlatTable.getCell(table, pos);
            const battleField = new BattleField(field.pos, field.status);
            fields.push(battleField);
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
    const ships = targetBoard.ships.map(x => new BattleShip(x));
    const battleBoard = new BattleBoard(targetRows, [...ships], canShoot);
    return battleBoard;
}

export function createOwnBoard(player: Player): BattleBoard {
    const ownBoard = player.board;
    const ownRows = createRowsAndFields(ownBoard);
    const ships = ownBoard.ships.map(x => new BattleShip(x));
    const battleBoard = new BattleBoard(ownRows, ships, false);
    return battleBoard;
}

export function reduceBoardWithBoard(state: BattleBoard, action: BattleBoard): BattleBoard | null {
    const board = action ? action.copy() : null;
    if (state && state.rows && board && board.rows) {
        const yLength = Math.min(state.rows.length, board.rows.length);
        for (let y = 0; y < yLength; y++) {
            if (state.rows[y].fields && board.rows[y].fields) {
                const xLength = Math.min(state.rows[y].fields.length, board.rows[y].fields.length);
                for (let x = 0; x < xLength; x++) {
                    board.rows[y].fields[x].shooting = state.rows[y].fields[x].shooting;
                }
            }
        }
    }
    return board;
}

export function reduceBoardWithField(state: BattleBoard, action: BattleField, change: (f: BattleField) => void): BattleBoard | null {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = state ? state.copy() : null;
    if (board && board.rows && y < board.rows.length && board.rows[y].fields && x < board.rows[y].fields.length) {
        change(board.rows[y].fields[x]);
    }
    return board;
}

export function reduceBoardWithShootingField(state: BattleBoard, action: BattleField): BattleBoard {
    const board = reduceBoardWithField(state, action, (field: BattleField) => {
        field.shooting = true;
    });
    return board;
}

export function reduceBoardWithShootingFieldReset(state: BattleBoard, action: BattleField): BattleBoard {
    const board = reduceBoardWithField(state, action, (field: BattleField) => {
        field.shooting = false;
    });
    return board;
}
