import { Ship } from './ship';
import { Field } from './field';

function checkFields(fields1: Field[], fields2: Field[]) {
    expect(fields1.length === fields2.length).toBeTruthy();
    for (let i = 0; i < fields1.length; i++) {
        expect(fields1[i].isEqual(fields2[i])).toBeTruthy();
    }
}

describe('Ship', () => {

    it('field should be initialized correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        expect(ship.key === key && ship.x === -1 && ship.y === -1 && ship.rotation === 0 && ship.fields.length === 0).toBeTruthy();
    });

    it('field should handle setPosition correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        ship.setPosition(2, 3);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0 && ship.fields.length === 2).toBeTruthy();
    });

    it('field should handle resetPosition correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        ship.setPosition(2, 3);
        ship.resetPosition();
        expect(ship.key === key && ship.x === -1 && ship.y === -1 && ship.rotation === 0 && ship.fields.length === 0).toBeTruthy();
    });

    it('field should handle rotate (2; 0x) correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3)];
        ship.setPosition(2, 3);
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });

    it('field should handle rotate (2; 1x) correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 3), new Field(3, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 90).toBeTruthy();
    });

    it('field should handle rotate (2; 2x) correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 3), new Field(2, 4)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 180).toBeTruthy();
    });

    it('field should handle rotate (2, 3x) correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(1, 3), new Field(2, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 270).toBeTruthy();
    });

    it('field should handle rotate (2; 4x) correctly', () => {
        const key = 'red';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });

    it('field should handle rotate (3; 0x) correctly', () => {
        const key = 'blue';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3), new Field(2, 4)];
        ship.setPosition(2, 3);
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });

    it('field should handle rotate (3; 1x) correctly', () => {
        const key = 'blue';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(1, 3), new Field(2, 3), new Field(3, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 90).toBeTruthy();
    });

    it('field should handle rotate (3; 2x) correctly', () => {
        const key = 'blue';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3), new Field(2, 4)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 180).toBeTruthy();
    });

    it('field should handle rotate (3, 3x) correctly', () => {
        const key = 'blue';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(1, 3), new Field(2, 3), new Field(3, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 270).toBeTruthy();
    });

    it('field should handle rotate (3; 4x) correctly', () => {
        const key = 'blue';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3), new Field(2, 4)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });

    it('field should handle rotate (4; 0x) correctly', () => {
        const key = 'purple';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3), new Field(2, 4), new Field(2, 5)];
        ship.setPosition(2, 3);
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });

    it('field should handle rotate (4; 1x) correctly', () => {
        const key = 'purple';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(0, 3), new Field(1, 3), new Field(2, 3), new Field(3, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 90).toBeTruthy();
    });

    it('field should handle rotate (4; 2x) correctly', () => {
        const key = 'purple';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 1), new Field(2, 2), new Field(2, 3), new Field(2, 4)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 180).toBeTruthy();
    });

    it('field should handle rotate (4, 3x) correctly', () => {
        const key = 'purple';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(1, 3), new Field(2, 3), new Field(3, 3), new Field(4, 3)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 270).toBeTruthy();
    });

    it('field should handle rotate (4; 4x) correctly', () => {
        const key = 'purple';
        const ship = new Ship(key);
        const x = 2;
        const y = 3;
        const fields = [new Field(2, 2), new Field(2, 3), new Field(2, 4), new Field(2, 5)];
        ship.setPosition(2, 3);
        ship.rotate();
        ship.rotate();
        ship.rotate();
        ship.rotate();
        checkFields(fields, ship.fields);
        expect(ship.key === key && ship.x === x && ship.y === y && ship.rotation === 0).toBeTruthy();
    });
});
