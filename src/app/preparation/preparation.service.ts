import { Injectable } from '@angular/core';
import { Ship } from '../shared/ship';

@Injectable()
export class PreparationService {
    private _isChanged = false;
    private _isValidated = false;

    private _width: number;
    private _height: number;
    private _ships: {};

    constructor() {
        this._ships = {};
        this._width = 8;
        this._height = 8;
    }

    get isChanged(): boolean {
        return this._isChanged;
    }

    get isValidated(): boolean {
        return this._isValidated;
    }

    reset() {
        this._isChanged = false;
        this._isValidated = false;
    }

    change() {
        this._isChanged = true;
    }

    validate() {
        this._isValidated = true;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    addShip(ship: Ship, x: number, y: number): boolean {
        if (this.getShipAt(x, y) === null) {
            ship.setPosition(x, y);
            this._ships[ship.key] = ship;
            return true;
        }
        return false;
    }

    removeShip(key: string): Ship {
        let ship = this._ships[key];
        if (ship === undefined) {
            ship = null;
        } else {
            delete this._ships[key];
        }
        return ship;
    }

    canAddShip(key: string, x: number, y: number): boolean {
        const ship: Ship = this.getShipAt(x, y);
        const canAddShip: boolean = (ship === null || ship.key === key);
        return canAddShip;
    }

    get ships(): Array<Ship> {
        const keys = Object.keys(this._ships);
        const ships = [];
        keys.forEach((key) => {
            ships.push(this._ships[key]);
        });
        return ships;
    }

    get count(): number {
        return this.ships.length;
    }

    getShipAt(x: number, y: number): Ship {
        for (const ship of this.ships) {
            if (ship.x === x && ship.y === y) {
                return ship;
            }
        }
        return null;
    }

    hasClash(x: number, y: number): boolean {
        let i = 0;
        for (const ship of this.ships) {
            if (ship.isOnField(x, y)) {
                i++;
            }
        }
        return 1 < i;
    }
}
