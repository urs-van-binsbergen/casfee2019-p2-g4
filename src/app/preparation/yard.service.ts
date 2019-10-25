import { Injectable } from '@angular/core';
import { Ship } from '../shared/ship';

@Injectable()
export class YardService {
    private _ships: {};
    private _keys = ['red', 'green', 'blue', 'turquoise', 'purple'];

    constructor() {
        this.reset();
    }

    get keys() {
        return [... this._keys];
    }

    get ships() {
        const keys = Object.keys(this._ships);
        const ships = [];
        keys.forEach((key) => {
            ships.push(this._ships[key]);
        });
        return ships;
    }

    reset() {
        this._ships = {};
        for (const key of this._keys) {
            this.addShip(new Ship(key));
        }
    }

    addShip(ship: Ship) {
        ship.resetPosition();
        this._ships[ship.key] = ship;
    }

    removeShip(id: string): Ship {
        let ship = this._ships[id];
        if (ship === undefined) {
            ship = null;
        } else {
            delete this._ships[id];
        }
        return ship;
    }

}
