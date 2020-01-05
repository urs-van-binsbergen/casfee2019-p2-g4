import { Player, Board, Ship, FieldStatus, PlayerStatus } from '@cloud-api/core-models';
import * as FlatTable from '@cloud-api/flat-table';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { Orientation, Pos, areEqualPos } from '@cloud-api/geometry';
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

function getShipPos(ship: Ship): Pos {
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
 * - Count number of sunk ships
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
    board.sunkShipsCount = board.ships.filter(s => s.isSunk).length;
}

export function createBattleBoard(board: Board, canShoot: boolean): BattleBoard {
    const rows = createRows(board);
    const ships = board.ships.map((ship: Ship) => {
        const battleShip: BattleShip = {
            pos: getShipPos(ship),
            length: ship.length,
            design: ship.design,
            isVertical: isVertical(ship),
            isSunk: ship.isSunk
        };
        return battleShip;
    });
    const battleBoard: BattleBoard = { rows, ships, canShoot, isShooting: false, sunkShipsCount: 0 };
    updateBattleBoard(battleBoard);
    return battleBoard;
}

export function createTargetBoard(player: Player): BattleBoard {
    const battleBoard = createBattleBoard(player.battle.targetBoard, player.canShootNext);
    return battleBoard;
}

export function createOwnBoard(player: Player): BattleBoard {
    const opponentCanShootNext = !player.canShootNext && player.playerStatus === PlayerStatus.InBattle;
    const battleBoard = createBattleBoard(player.board, opponentCanShootNext);
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

    let sunkShipsBefore: number;
    let lastShotPos: Pos;
    let currentShotResult: FieldStatus;
    let shipSunk: boolean;

    if (state) {
        // Transfer and diff presentational data from old state
        sunkShipsBefore = state.sunkShipsCount;
        lastShotPos = state.lastShotPos;

        const yLength = Math.min(state.rows.length, board.rows.length);
        for (let y = 0; y < yLength; y++) {
            const xLength = Math.min(state.rows[y].fields.length, board.rows[y].fields.length);
            for (let x = 0; x < xLength; x++) {
                const oldField = state.rows[y].fields[x];
                const newField = board.rows[y].fields[x];

                newField.shooting = oldField.shooting;

                if (oldField.status === FieldStatus.Unknown && newField.status !== FieldStatus.Unknown) {
                    currentShotResult = newField.status;
                    lastShotPos = { x, y };
                    newField.shooting = true;
                }
            }
        }

        if (board.sunkShipsCount > sunkShipsBefore) {
            shipSunk = true;
        }
    }

    board.lastShotResult = currentShotResult;
    board.lastShotPos = lastShotPos;
    board.shipSunk = shipSunk;

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

export function updateBoardWithFieldIsShooting(state: BattleBoard, action: BattleField, shooting: boolean): BattleBoard {
    const x = action.pos.x;
    const y = action.pos.y;
    const board = deepClone(state) as BattleBoard;
    if (y < board.rows.length && x < board.rows[y].fields.length) {
        board.rows[y].fields[x].shooting = shooting;
    }
    updateBattleBoard(board);

    return board;
}
