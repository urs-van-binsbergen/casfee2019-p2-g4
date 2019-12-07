import * as BattleMethods from './battle-methods';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { Board, FieldStatus } from '@cloud-api/core-models';
import { Pos } from '@cloud-api/geometry';

function createBattleBoard(width: number, height: number, canShoot: boolean, pos: Pos,
                           change: (f: BattleField) => void): BattleBoard {
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
    const board: BattleBoard = { rows, ships, canShoot, isShooting: false };
    if (pos && change) {
        change(board.rows[pos.y].fields[pos.x]);
        board.isShooting = board.rows[pos.y].fields[pos.x].shooting;
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
        const battleBoard = BattleMethods.createBattleBoard(board, false);
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
            canShoot: false, isShooting: false
        };
        expect(str(board)).toBe(boardBefore);
        expect(str(battleBoard)).toBe(str(reference));
    });

    it('reduce BattleBoard with null', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null, null);
        const board = BattleMethods.reduceBoardWithBoard(state, null);
        expect(board).toBe(null);
    });

    it('reduce BattleBoard with state', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null, null);
        const stateBefore = str(state);
        const action = state;
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('reduce BattleBoard with same action as state', () => {
        const state = createBattleBoard(refWidth, refHeight, true, null, null);
        const stateBefore = str(state);
        const action = createBattleBoard(refWidth, refHeight, true, null, null);
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('reduce BattleBoard with action (Unknown -> Hit)', () => {
        const x = 0;
        const y = 0;
        const shooting = true;
        const status = FieldStatus.Hit;
        const state = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.shooting = shooting;
        });
        const stateBefore = str(state);
        const action = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.status = status;
        });
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.status = status;
            battleField.shooting = shooting;
        });
        expect(str(board)).toBe(str(reference));
    });

    it('reduce BattleBoard with action (Unknown -> Miss)', () => {
        const x = 0;
        const y = 0;
        const shooting = true;
        const status = FieldStatus.Miss;
        const state = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.shooting = shooting;
        });
        const stateBefore = str(state);
        const action = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.status = status;
        });
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.status = status;
            battleField.shooting = shooting;
        });
        expect(str(board)).toBe(str(reference));
    });

    it('reduce BattleBoard with shooting field', () => {
        const x = 0;
        const y = 0;
        const state = createBattleBoard(refWidth, refHeight, true, { x, y }, null);
        const stateBefore = str(state);
        const action = state.rows[y].fields[x];
        const board = BattleMethods.reduceBoardWithShootingField(state, action);
        expect(stateBefore).toBe(str(state));
        const reference = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.shooting = true;
        });
        expect(str(board)).toBe(str(reference));
    });

    it('reduce BattleBoard with shooting field reset', () => {
        const x = 0;
        const y = 0;
        const state = createBattleBoard(refWidth, refHeight, true, { x, y }, (battleField: BattleField) => {
            battleField.shooting = true;
        });
        const stateBefore = str(state);
        const action = state.rows[y].fields[x];
        const board = BattleMethods.reduceBoardWithShootingFieldReset(state, action);
        expect(stateBefore).toBe(str(state));
        const reference = createBattleBoard(refWidth, refHeight, true, { x, y }, null);
        expect(str(board)).toBe(str(reference));
    });

});
