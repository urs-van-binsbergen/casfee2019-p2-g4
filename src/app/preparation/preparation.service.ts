import { Injectable } from '@angular/core';
import { Ship } from '../shared/ship';
import { Field } from '../shared/field';

@Injectable()
export class PreparationService {

    private _width: number;
    private _height: number;
    private _ships: {};
    private _isChanged: boolean;

    constructor() {
        this._width = 8;
        this._height = 8;
        this.reset();
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get ships(): Ship[] {
        const keys = Object.keys(this._ships);
        const ships = [];
        keys.forEach((key) => {
            ships.push(this._ships[key]);
        });
        return ships;
    }

    get isChanged(): boolean {
        return this._isChanged;
    }

    get isValid(): boolean {
        const ships = this.ships;
        if (ships.length !== 5) {
            return false;
        }
        for (const ship of ships) {
            if (!(ship.areFieldsInRange(0, this.width, 0, this.height))) {
                return false;
            }
        }
        for (let i = 0; i < ships.length; i++) {
            const ship1 = ships[i];
            for (let j = (i + 1); j < ships.length; j++) {
                const ship2 = ships[j];
                if (ship1.hasClashWithShip(ship2)) {
                    return false;
                }
            }
        }
        return true;
    }

    reset() {
        this._ships = {};
        this._isChanged = false;
    }

    addShip(ship: Ship, x: number, y: number): boolean {
        if (this.getShipAt(x, y) === null) {
            ship.setPosition(x, y);
            this._ships[ship.key] = ship;
            this._isChanged = true;
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
            this._isChanged = true;
        }
        return ship;
    }

    canAddShip(key: string, x: number, y: number): boolean {
        const ship: Ship = this.getShipAt(x, y);
        const canAddShip: boolean = (ship === null || ship.key === key);
        return canAddShip;
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
        const field = new Field(x, y);
        for (const ship of this.ships) {
            if (ship.hasField(field)) {
                i++;
            }
        }
        return 1 < i;
    }
}
