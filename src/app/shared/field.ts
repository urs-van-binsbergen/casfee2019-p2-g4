export class Field {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    isEqual(field: Field): boolean {
        return field && field.x === this.x && field.y === this.y;
    }
}
