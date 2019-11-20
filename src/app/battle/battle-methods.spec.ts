import * as BattleMethods from './battle-methods';
import { Row, BattleField, BattleBoard, BattleShip } from './battle-models';
import { FieldStatus } from '@cloud-api/core-models';

function refBoard(width: number, height: number): BattleBoard {
    const rows: Row[] = [];
    for (let y = 0; y < height; y++) {
        const fields: BattleField[] = [];
        for (let x = 0; x < width; x++) {
            const field = new BattleField({x, y}, FieldStatus.Unknown);
            fields.push(field);
        }
        const row = new Row(fields);
        rows.push(row);
    }
    const ships: BattleShip[] = [];
    const board = new BattleBoard(rows, ships, true);
    return board;
}

function str(v: any): string {
    return JSON.stringify(v);
}

describe('BattleMethods', () => {

    const refWidth = 2;
    const refHeight = 2;
    let state: BattleBoard;

    beforeEach(() => {
       state = refBoard(refWidth, refHeight);
    });

    afterEach(() => {
        state = null;
    });

    it('reduce board with null', () => {
        const board = BattleMethods.reduceBoardWithBoard(state, null);
        expect(board).toBe(null);
    });

    it('reduce board with state', () => {
        const stateBefore = str(state);
        const action = state;
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('reduce board with same action as state', () => {
        const stateBefore = str(state);
        const action = refBoard(refWidth, refHeight);
        const actionBefore = str(action);
        expect(stateBefore).toBe(actionBefore);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        expect(str(board)).toBe(str(action));
    });

    it('reduce board with action (Unknown -> Hit)', () => {
        const x = 0;
        const y = 0;
        const shooting = true;
        const status = FieldStatus.Hit;
        state.rows[y].fields[x].shooting = shooting;
        const stateBefore = str(state);
        const action = refBoard(refWidth, refHeight);
        action.rows[y].fields[x].status = status;
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));

        const reference = refBoard(refWidth, refHeight);
        reference.rows[y].fields[x].status = status;
        reference.rows[y].fields[x].shooting = shooting;
        expect(str(board)).toBe(str(reference));
    });

    it('reduce board with action (Unknown -> Miss)', () => {
        const x = 0;
        const y = 0;
        const shooting = true;
        const status = FieldStatus.Miss;
        state.rows[y].fields[x].shooting = shooting;
        const stateBefore = str(state);
        const action = refBoard(refWidth, refHeight);
        action.rows[y].fields[x].status = status;
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithBoard(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));

        const reference = refBoard(refWidth, refHeight);
        reference.rows[y].fields[x].status = status;
        reference.rows[y].fields[x].shooting = shooting;
        expect(str(board)).toBe(str(reference));
    });

    it('reduce board with shooting field', () => {
        const x = 0;
        const y = 0;
        const stateBefore = str(state);
        const action = new BattleField({x, y}, FieldStatus.Unknown);
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithShootingField(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = refBoard(refWidth, refHeight);
        const refField = new BattleField({x, y}, FieldStatus.Unknown);
        refField.shooting = true;
        reference.rows[y].fields[x] = refField;
        expect(str(board)).toBe(str(reference));
    });

    it('reduce board with shooting field reset', () => {
        const x = 0;
        const y = 0;
        const field = new BattleField({x, y}, FieldStatus.Unknown);
        field.shooting = true;
        state.rows[y].fields[x] = field;
        const stateBefore = str(state);
        const action = new BattleField({x, y}, FieldStatus.Unknown);
        const actionBefore = str(action);
        const board = BattleMethods.reduceBoardWithShootingFieldReset(state, action);
        expect(stateBefore).toBe(str(state));
        expect(actionBefore).toBe(str(action));
        const reference = refBoard(refWidth, refHeight);
        expect(str(board)).toBe(str(reference));
    });

});