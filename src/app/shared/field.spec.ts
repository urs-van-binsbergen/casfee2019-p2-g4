import { Field } from './field';

describe('Field', () => {

    it('field should be initialized with correct x', () => {
        const x = 2;
        const y = 3;
        const field = new Field(x, y);
        expect(field.x === x).toBeTruthy();
    });

    it('field should be initialized with correct y', () => {
        const x = 2;
        const y = 3;
        const field = new Field(x, y);
        expect(field.y === y).toBeTruthy();
    });

    it('field should be equal to field', () => {
        const field = new Field(2, 3);
        expect(field.isEqual(field)).toBeTruthy();
    });

    it('field1 should be equal to field2', () => {
        const field1 = new Field(2, 3);
        const field2 = new Field(2, 3);
        expect(field1.isEqual(field2)).toBeTruthy();
    });

    it('field1 should not be equal to field2 with different x', () => {
        const field1 = new Field(2, 3);
        const field2 = new Field(4, 3);
        expect(field1.isEqual(field2)).toBeFalsy();
    });

    it('field1 should not be equal to field2 with different y', () => {
        const field1 = new Field(2, 3);
        const field2 = new Field(2, 5);
        expect(field1.isEqual(field2)).toBeFalsy();
    });

    it('field should not be equal to undefined', () => {
        const field = new Field(2, 3);
        expect(field.isEqual(undefined)).toBeFalsy();
    });

    it('field should not be equal to null', () => {
        const field = new Field(2, 3);
        expect(field.isEqual(null)).toBeFalsy();
    });
});
