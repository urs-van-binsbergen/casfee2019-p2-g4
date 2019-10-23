import { Injectable } from '@angular/core';
import { Ship } from '../shared/ship';

@Injectable()
export class YardService {
    private _ships: {};

    constructor() {
        this.reset();
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
        this.addShip(new Ship('red'));
        this.addShip(new Ship('green'));
        this.addShip(new Ship('blue'));
        this.addShip(new Ship('turquoise'));
        this.addShip(new Ship('purple'));
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
