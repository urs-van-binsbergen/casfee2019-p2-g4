import { Player, Board, Ship, FieldStatus } from '@cloud-api/core-models';
import * as FlatTable from '@cloud-api/flat-table';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { Orientation, Pos } from '@cloud-api/geometry';
import deepClone from 'clone-deep';

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

function updateBattleBoard(board: BattleBoard) {

    function isShootingBoard(rows: Row[]): boolean {
        if (rows) {
            for (const row of rows) {
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

    if (board) {
        let isShooting = false;
        if (board.rows) {
            isShooting = isShootingBoard(board.rows);
            for (const row of board.rows) {
                if (row.fields) {
                    for (const field of row.fields) {
                        field.shootable = !isShooting && field.status === FieldStatus.Unknown;
                    }
                }
            }
        }
        board.isShooting = isShooting;
    }
}

export function createBattleBoard(board: Board, canShoot: boolean): BattleBoard {
    const rows = createRows(board);
    const ships = board.ships.map((ship: Ship) => {
        const battleShip: BattleShip = {
            pos: createPos(ship),
            length: ship.length,
            isVertical: isVertical(ship),
            isInverse: isInverse(ship),
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

export function reduceBoardWithBoard(state: BattleBoard, action: BattleBoard): BattleBoard | null {
    const board = action ? deepClone(action) : null;
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
    updateBattleBoard(board);
    return board;
}

export function reduceTargetBoardWithPlayer(state: BattleBoard, action: Player): BattleBoard | null {
    const board = action ? createTargetBoard(action) : null;
    const targetBoard = reduceBoardWithBoard(state, board);
    return targetBoard;
}

export function reduceOwnBoardWithPlayer(state: BattleBoard, action: Player): BattleBoard | null {
    const board = action ? createOwnBoard(action) : null;
    const ownBoard = reduceBoardWithBoard(state, board);
    return ownBoard;
}

function reduceBoardWithField(state: BattleBoard, action: BattleField, change: (f: BattleField) => void): BattleBoard | null {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = state ? deepClone(state) : null;
    if (board && board.rows && y < board.rows.length && board.rows[y].fields && x < board.rows[y].fields.length) {
        change(board.rows[y].fields[x]);
    }
    updateBattleBoard(board);
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
