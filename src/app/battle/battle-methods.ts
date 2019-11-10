import { FlatGrid, Field as CoreField, FieldStatus, Player, Pos, Ship } from '@cloud-api/core-models';
import { Row, BattleField, BattleBoard } from './battle-models';
import { findFieldByPos } from '@cloud-api/core-methods';

function createRowsAndFields(grid: FlatGrid<CoreField>): Row[] {
    const rows: Row[] = [];
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

export function copyField(f: BattleField): BattleField {
    const battleField = new BattleField(f.pos, f.status);
    battleField.shooting = f.shooting;
    return battleField;
}

export function copyRow(r: Row): Row {
    const battleFields: BattleField[] = [];
    for (const field of r.fields) {
        const battleField = copyField(field);
        battleFields.push(battleField);
    }
    const row = new Row(battleFields);
    return row;
}

export function copyRows(rs: Row[]) {
    const rows: Row[] = [];
    for (const r of rs) {
        const row = copyRow(r);
        rows.push(row);
    }
    return rows;
}

export function copyShip(s: Ship): Ship {
    const ship = {
        pos: s.pos,
        length: s.length,
        isVertical: s.isVertical,
        hits: [... s.hits],
        isSunk: s.isSunk
    };
    return ship;
}

export function copyShips(ss: Ship[]) {
    const ships: Ship[] = [];
    for (const s of ss) {
        const ship = copyShip(s);
        ships.push(ship);
    }
    return ships;
}

export function copyBoard(b: BattleBoard): BattleBoard {
    const rows = copyRows(b.rows);
    const ships = copyShips(b.ships);
    const canShoot = b.canShoot;
    const board = new BattleBoard(rows, ships, canShoot);
    return board;
}

export function isShooting(board: BattleBoard): boolean {
    if (board && board.rows) {
        for (const row of board.rows) {
            if (row.fields) {
                for (const field of row.fields) {
                    if (field.shooting) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

export function reduceFieldWithField(state: BattleField, action: BattleField): BattleField {
    const field = copyField(action);
    if (state && field) {
        if ((field.status === FieldStatus.Hit || field.status === FieldStatus.Miss) && state.shooting) {
            field.shooting = true;
        }
    }
    return field;
}

export function laodBoard(): BattleBoard {
    const rows: Row[] = [];
    for (let y = 0 ; y < 8; y++) {
        const battleFields: BattleField[] = [];
        for (let x = 0; x < 8; x++) {
            const pos: Pos = {x, y};
            const battleField = new BattleField(pos, FieldStatus.Unknown);
            battleFields.push(battleField);
        }
        const row = new Row(battleFields);
        rows.push(row);
    }
    const ships = [
        {
            pos: {x: 2, y: 3},
            length: 3,
            isVertical: true,
            hits: [],
            isSunk: false
        }
    ];
    const board = new BattleBoard(rows, ships, true);
    return board;
}

export function reduceBoardWithBoard(state: BattleBoard, action: BattleBoard): BattleBoard {
    const board = copyBoard(action);
    if (board && board.rows) {
        for (let y = 0; y < board.rows.length; y++) {
            const row = board.rows[y];
            if (row.fields) {
                for (let x = 0; x < row.fields.length; x++) {
                    if (state && state.rows && y < state.rows.length && state.rows[y].fields && x < state.rows[y].fields.length) {
                        board.rows[y].fields[x] = reduceFieldWithField(state.rows[y].fields[x], board.rows[y].fields[x]);
                    }
                }
            }
        }
    }
    return board;
}

export function reduceBoardWithShootingField(state: BattleBoard, action: BattleField): BattleBoard {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = copyBoard(state);
    if (state && state.rows && y < state.rows.length && state.rows[y].fields && x < state.rows[y].fields.length) {
        board.rows[y].fields[x].shooting = true;
    }
    return board;
}

export function reduceBoardWithUncoveringField(state: BattleBoard, action: BattleField, hit: boolean): BattleBoard {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = copyBoard(state);
    if (state && state.rows && y < state.rows.length && state.rows[y].fields && x < state.rows[y].fields.length) {
        board.rows[y].fields[x].status = hit ? FieldStatus.Hit : FieldStatus.Miss;
    }
    return board;
}

export function reduceBoardWithUncoveredField(state: BattleBoard, action: BattleField): BattleBoard {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = copyBoard(state);
    if (state && state.rows && y < state.rows.length && state.rows[y].fields && x < state.rows[y].fields.length) {
        board.rows[y].fields[x].shooting = false;
    }
    return board;
}
