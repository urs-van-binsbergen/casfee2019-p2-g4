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

    isShip2Field(x: number, y: number): boolean {
        if (this._rotation === 0) {
            if (x === this._x) {
                for (let i = (this._y - 1); i < (this._y + 1); i++) {
                    if (i === y) {
                        return true;
                    }
                }
            }
        } else if (this._rotation === 90) {
            if (y === this._y) {
                for (let i = this._x; i < (this._x + 2); i++) {
                    if (i === x) {
                        return true;
                    }
                }
            }
        } else if (this._rotation === 180) {
            if (x === this._x) {
                for (let i = this._y; i < (this._y + 2); i++) {
                    if (i === y) {
                        return true;
                    }
                }
            }
        } else {
            if (y === this._y) {
                for (let i = (this._x - 1); i < (this._x + 1); i++) {
                    if (i === x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isShip3Field(x: number, y: number): boolean {
        if (this._rotation === 0 || this._rotation === 180) {
            if (x === this._x) {
                for (let i = (this._y - 1); i < (this._y + 2); i++) {
                    if (i === y) {
                        return true;
                    }
                }
            }
        } else {
            if (y === this._y) {
                for (let i = (this._x - 1); i < (this._x + 2); i++) {
                    if (i === x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isShip4Field(x: number, y: number): boolean {
        if (this._rotation === 0) {
            if (x === this._x) {
                for (let i = (this._y - 1); i < (this._y + 3); i++) {
                    if (i === y) {
                        return true;
                    }
                }
            }
        } else if (this._rotation === 90) {
            if (y === this._y) {
                for (let i = (this._x - 2); i < (this._x + 2); i++) {
                    if (i === x) {
                        return true;
                    }
                }
            }
        } else if (this._rotation === 180) {
            if (x === this._x) {
                for (let i = (this._y - 2); i < (this._y + 2); i++) {
                    if (i === y) {
                        return true;
                    }
                }
            }
        } else {
            if (y === this._y) {
                for (let i = (this._x - 1); i < (this._x + 3); i++) {
                    if (i === x) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isOnField(x: number, y: number): boolean {
        let isOnField: boolean;
        if (this.key === 'red') {
            isOnField = this.isShip2Field(x, y);
        } else if (this.key === 'green' || this.key === 'blue') {
            isOnField = this.isShip3Field(x, y);
        } else {
            isOnField = this.isShip4Field(x, y);
        }
        return isOnField;
    }
}
