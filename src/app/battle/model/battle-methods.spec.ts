import * as BattleMethods from './battle-methods';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { Board, FieldStatus } from '@cloud-api/core-models';
import { Pos } from '@cloud-api/geometry';

interface Move {
    target: Pos;
    shooting: boolean;
    result?: FieldStatus;
}

function createBattleBoard(width: number, height: number, canShoot: boolean, move: Move): BattleBoard {
    const rows: Row[] = [];
    for (let y = 0; y < height; y++) {
        const fields: BattleField[] = [];
        for (let x = 0; x < width; x++) {
            const field = {
                pos: { x, y },
                status: FieldStatus.Unknown,
                shooting: false,
                shootable: false
            };
            fields.push(field);
        }
        const row: Row = { fields };
        rows.push(row);
    }
    const ships: BattleShip[] = [];
    const board: BattleBoard = { rows, ships, canShoot, isShooting: false, sunkShipsCount: 0 };
    if (move) {
        const pos = move.target;
        const field = board.rows[pos.y].fields[pos.x];

        field.shooting = move.shooting;
        board.isShooting = move.shooting;

        if (move.result) {
            field.status = move.result;
            board.lastShotResult = move.result;
            board.lastShotPos = move.target;
            field.shooting = true;
        }
    }
    for (const row of board.rows) {
        if (row.fields) {
            for (const field of row.fields) {
                field.shootable = !(board.isShooting) && field.status === FieldStatus.Unknown;
            }
        }
    }
    return board;
}

function str(v: any): string {
    return JSON.stringify(v);
}

describe('BattleMethods', () => {

    const refWidth = 2;
    const refHeight = 2;

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('create Board', () => {
        const board: Board = {
            fields: [
                { pos: { x: 0, y: 0 }, status: 1 },
                { pos: { x: 1, y: 0 }, status: 1 },
                { pos: { x: 0, y: 1 }, status: 0 },
                { pos: { x: 1, y: 1 }, status: 0 }
            ],
            ships: [
                { design: 55, hits: [0, 1], isSunk: true, length: 2, orientation: 0, pos: { x: 0, y: 0 } }
            ],
            size: { h: 2, w: 2 }
        };
        const boardBefore = str(board);
        const battleBoard = BattleMethods.createBattleBoard(board, true);
        const reference: BattleBoard = {
            rows: [
                {
                    fields: [
                        { pos: { x: 0, y: 0 }, status: 1, shooting: false, shootable: false },
                        { pos: { x: 1, y: 0 }, status: 1, shooting: false, shootable: false }]
                },
                {
                    fields: [
                        { pos: { x: 0, y: 1 }, status: 0, shooting: false, shootable: true },
                        { pos: { x: 1, y: 1 }, status: 0, shooting: false, shootable: true }]
                }
            ],
            ships: [
                { pos: { x: 0, y: 0 }, length: 2, design: 55, isVertical: false, isSunk: true }
            ],
            canShoot: true,
            isShooting: false,
            sunkShipsCount: 1
        };
        expect(str(board)).toBe(boardBefore);
        expect(str(battleBoard)).toBe(str(reference));
    });

    it('update BattleBoard with null action throws', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null);
        expect(() => BattleMethods.updateBoardWithBoard(state, null)).toThrow();
    });

    it('reduce BattleBoard with state', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null);
        const stateBefore = str(state);
        const action = state;
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.updateBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('reduce BattleBoard with same action as state', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null);
        const stateBefore = str(state);
        const action = createBattleBoard(refWidth, refHeight, true, null);
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.updateBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('shoot and hit', () => {
        const x = 0;
        const y = 0;

        // State after shot is fired
        const shooting = true;
        const state = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting });
        const stateBefore = str(state);

        // State from server (firestore update):
        const result = FieldStatus.Hit;
        const action = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting, result });
        const actionBefore = str(action);

        // Apply state from server
        const board = BattleMethods.updateBoardWithBoard(state, action);

        // Assert
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting, result });
        expect(str(board)).toBe(str(reference));
    });

    it('shoot and miss', () => {
        const x = 0;
        const y = 0;

        // State after shot is fired
        const shooting = true;
        const state = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting });
        const stateBefore = str(state);

        // State from server (firestore update)
        const result = FieldStatus.Miss;
        const action = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting, result });
        const actionBefore = str(action);

        // Apply state from server:
        const board = BattleMethods.updateBoardWithBoard(state, action);

        // Assert
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting, result });
        expect(str(board)).toBe(str(reference));
    });

    it('start shooting', () => {
        const x = 0;
        const y = 0;
        const state = createBattleBoard(refWidth, refHeight, true, null);
        const stateBefore = str(state);
        const action = state.rows[y].fields[x];
        const board = BattleMethods.updateBoardWithFieldIsShooting(state, action, true);
        expect(stateBefore).toBe(str(state));
        const reference = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting: true });
        expect(str(board)).toBe(str(reference));
    });

    it('shooting complete (but waiting for result)', () => {
        const x = 0;
        const y = 0;
        const state = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting: true });
        const stateBefore = str(state);
        const action = state.rows[y].fields[x];
        const board = BattleMethods.updateBoardWithFieldIsShooting(state, action, false);
        expect(stateBefore).toBe(str(state));
        const reference = createBattleBoard(refWidth, refHeight, true, { target: { x, y }, shooting: false });
        expect(str(board)).toBe(str(reference));
    });

});
