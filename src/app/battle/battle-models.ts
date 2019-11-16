import { FieldStatus, Ship, Field as CoreField, Pos, Orientation } from '@cloud-api/core-models';

export class Row {
    constructor(
        public fields: BattleField[]
    ) {

    }
}

export class BattleField implements CoreField {
    constructor(
        public pos: Pos,
        public status: FieldStatus
    ) {
    }

    shooting = false;

    get shootable(): boolean {
        return this.status === FieldStatus.Unknown && !this.shooting;
    }
}

export class BattleBoard {
    constructor(
        public rows: Row[],
        public ships: BattleShip[],
        public canShoot: boolean
    ) {

    }
}

export class BattleShip {
    // TODO: just a temporary back compat wrapper, since the view does not implement orientation yet

    get isVertical(): boolean {
        return this._ship.orientation === Orientation.North ||
            this._ship.orientation === Orientation.South;
    }

    get isInverse(): boolean {
        return this._ship.orientation === Orientation.North ||
            this._ship.orientation === Orientation.West;
    }

    get pos(): Pos {
        if (this.isInverse) {
            if (this.isVertical) {
                return {
                    x: this._ship.pos.x,
                    y: this._ship.pos.y - this._ship.length + 1
                };
            } else {
                return {
                    x: this._ship.pos.x - this._ship.length + 1,
                    y: this._ship.pos.y
                };
            }
        } else {
            return this._ship.pos;
        }
    }

    get length(): number {
        return this._ship.length;
    }

    get isSunk(): boolean {
        return this._ship.isSunk;
    }

    constructor(
        private _ship: Ship
    ) {

    }
}
