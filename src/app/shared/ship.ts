import { Field } from './field';

export class Ship {
    private _key: string;
    private _x: number;
    private _y: number;
    private _rotation: number;
    private _fields: Field[];

    constructor(key: string) {
        this._key = key;
        this.resetPosition();
    }

    get key(): string {
        return this._key;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get rotation(): number {
        return this._rotation;
    }

    get fields(): Field[] {
        return this._fields;
    }

    resetPosition() {
        this._x = -1;
        this._y = -1;
        this._rotation = 0;
        this.update();
    }

    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
        this.update();
    }

    rotate() {
        this._rotation = (this._rotation + 90) % 360;
        this.update();
    }

    hasField(field: Field) {
        for (const f of this.fields) {
            if (f.isEqual(field)) {
                return true;
            }
        }
        return false;
    }

    areFieldsInRange(xMin: number, xMax: number, yMin: number, yMax: number) {
        for (const field of this.fields) {
            if (field.x < xMin || xMax <= field.x || field.y < yMin || yMax <= field.y) {
                return false;
            }
        }
        return true;
    }

    hasClashWithShip(ship: Ship): boolean {
        for (const f1 of this.fields) {
            for (const f2 of ship.fields) {
                if (f1.isEqual(f2)) {
                    return true;
                }
            }
        }
        return false;
    }

    private update() {
        this._fields = [];
        if (this.key === 'red') {
            this.update2();
        } else if (this.key === 'green' || this.key === 'blue') {
            this.update3();
        } else {
            this.update4();
        }
    }

    private update2() {
        if (this._rotation === 0) {
            for (let y = (this._y - 1); y < (this._y + 1); y++) {
                const field = new Field(this._x, y);
                this._fields.push(field);
            }
        } else if (this._rotation === 90) {
            for (let x = this._x; x < (this._x + 2); x++) {
                const field = new Field(x, this._y);
                this._fields.push(field);
            }
        } else if (this._rotation === 180) {
            for (let y = this._y; y < (this._y + 2); y++) {
                const field = new Field(this._x, y);
                this._fields.push(field);
            }
        } else {
            for (let x = (this._x - 1); x < (this._x + 1); x++) {
                const field = new Field(x, this._y);
                this._fields.push(field);
            }
        }
    }

    private update3() {
        if (this._rotation === 0 || this._rotation === 180) {
            for (let y = (this._y - 1); y < (this._y + 2); y++) {
                const field = new Field(this._x, y);
                this._fields.push(field);
            }
        } else {
            for (let x = (this._x - 1); x < (this._x + 2); x++) {
                const field = new Field(x, this._y);
                this._fields.push(field);
            }
        }
    }

    private update4() {
        if (this._rotation === 0) {
            for (let y = (this._y - 1); y < (this._y + 3); y++) {
                const field = new Field(this._x, y);
                this._fields.push(field);
            }
        } else if (this._rotation === 90) {
            for (let x = (this._x - 2); x < (this._x + 2); x++) {
                const field = new Field(x, this._y);
                this._fields.push(field);
            }
        } else if (this._rotation === 180) {
            for (let y = (this._y - 2); y < (this._y + 2); y++) {
                const field = new Field(this._x, y);
                this._fields.push(field);
            }
        } else {
            for (let x = (this._x - 1); x < (this._x + 3); x++) {
                const field = new Field(x, this._y);
                this._fields.push(field);
            }
        }
    }

}
