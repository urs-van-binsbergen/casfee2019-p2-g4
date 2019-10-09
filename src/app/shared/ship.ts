import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class Ship {
    private _key: string;
    private _x: number;
    private _y: number;
    private _rotation: number;

    constructor(key: string) {
        this._key = key;
        this.resetPosition();
        this._rotation = 0;
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

    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    resetPosition() {
        this._x = -1;
        this._y = -1;
    }

    rotate() {
        this._rotation = (this._rotation + 90) % 360;
    }
}
