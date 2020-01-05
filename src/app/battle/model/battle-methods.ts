import { Player, Board, Ship, FieldStatus } from '@cloud-api/core-models';
import * as FlatTable from '@cloud-api/flat-table';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { Orientation, Pos } from '@cloud-api/geometry';
import deepClone from 'clone-deep';

/*
Methods to transform the entity model to the presentational model, and also to detect
transitions (like 'is shooting' or 'last shoot was a hit').

Note: the term 'state' does not relate to 'state management' in the Redux sense here.
*/

function isInverse(ship: Ship): boolean {
    return ship.orientation === Orientation.North || ship.orientation === Orientation.West;
}

function isVertical(ship: Ship): boolean {
    return ship.orientation === Orientation.North || ship.orientation === Orientation.South;
}

function createPos(ship: Ship): Pos {
    if (isInverse(ship)) {
        if (isVertical(ship)) {
            return {
                x: ship.pos.x,
                y: ship.pos.y - ship.length + 1
            };
        } else {
            return {
                x: ship.pos.x - ship.length + 1,
                y: ship.pos.y
            };
        }
    } else {
        return ship.pos;
    }
}

function createBattleField(pos: Pos, status: FieldStatus): BattleField {
    return {
        pos: deepClone(pos),
        status,
        shooting: false,
        shootable: false
    };
}

function createRows(board: Board): Row[] {
    const table = { size: board.size, cells: board.fields };
    const rows: Row[] = [];
    const size = table.size;
    for (let y = 0; y < size.h; y++) {
        const fields: BattleField[] = [];
        for (let x = 0; x < size.h; x++) {
            const pos = { x, y };
            const field = FlatTable.getCell(table, pos);
            const battleField = createBattleField(pos, field.status);
            fields.push(battleField);
        }
        const row: Row = { fields };
        rows.push(row);
    }
    return rows;
}

/* 
 * Inner update: 
 * - Detect 'is shooting' and apply to board
 * - Set shootability of fields
 */
function updateBattleBoard(board: BattleBoard) {

    function isShootingBoard(rows: Row[]): boolean {
        for (const row of rows) {
            for (const field of row.fields) {
                if (field.shooting) {
                    return true;
                }
            }
        }
        return false;
    }

    const isShooting = isShootingBoard(board.rows);
    for (const row of board.rows) {
        for (const field of row.fields) {
            field.shootable = board.canShoot && !isShooting && field.status === FieldStatus.Unknown;
        }
    }

    board.isShooting = isShooting;
}

export function createBattleBoard(board: Board, canShoot: boolean): BattleBoard {
    const rows = createRows(board);
    const ships = board.ships.map((ship: Ship) => {
        const battleShip: BattleShip = {
            pos: createPos(ship),
            length: ship.length,
            design: ship.design,
            isVertical: isVertical(ship),
            isSunk: ship.isSunk
        };
        return battleShip;
    });
    const battleBoard = { rows, ships, canShoot, isShooting: false };
    updateBattleBoard(battleBoard);
    return battleBoard;
}

export function createTargetBoard(player: Player): BattleBoard {
    const battleBoard = createBattleBoard(player.battle.targetBoard, player.canShootNext);
    return battleBoard;
}

export function createOwnBoard(player: Player): BattleBoard {
    const battleBoard = createBattleBoard(player.board, false);
    return battleBoard;
}

/*
 * Apply new board state
 * Params: 
 * - state: existing presentational state (can be null initially)
 * - action: the new state (typically from firestore)
 */
export function updateBoardWithBoard(state: BattleBoard | null, action: BattleBoard): BattleBoard {
    const board = deepClone(action) as BattleBoard;

    if (state) {
        // Transfer presentational data from old state
        const yLength = Math.min(state.rows.length, board.rows.length);
        for (let y = 0; y < yLength; y++) {
            const xLength = Math.min(state.rows[y].fields.length, board.rows[y].fields.length);
            for (let x = 0; x < xLength; x++) {
                board.rows[y].fields[x].shooting = state.rows[y].fields[x].shooting;
            }
        }
    }
    updateBattleBoard(board);
    return board;
}

export function updateTargetBoardWithPlayer(state: BattleBoard, action: Player): BattleBoard {
    const board = createTargetBoard(action);
    const targetBoard = updateBoardWithBoard(state, board);
    return targetBoard;
}

export function updateOwnBoardWithPlayer(state: BattleBoard, action: Player): BattleBoard {
    const board = createOwnBoard(action);
    const ownBoard = updateBoardWithBoard(state, board);
    return ownBoard;
}

function updateBoardWithField(state: BattleBoard, action: BattleField, change: (f: BattleField) => void): BattleBoard {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = deepClone(state) as BattleBoard;
    if (y < board.rows.length && x < board.rows[y].fields.length) {
        change(board.rows[y].fields[x]);
    }
    updateBattleBoard(board);
    return board;
}

export function updateBoardWithShootingField(state: BattleBoard, action: BattleField): BattleBoard {
    const board = updateBoardWithField(state, action, (field: BattleField) => {
        field.shooting = true;
    });
    return board;
}

export function updateBoardWithShootingFieldReset(state: BattleBoard, action: BattleField): BattleBoard {
    const board = updateBoardWithField(state, action, (field: BattleField) => {
        field.shooting = false;
    });
    return board;
}
