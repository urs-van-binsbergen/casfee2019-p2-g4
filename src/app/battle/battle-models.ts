import { FieldStatus, Ship, Field as CoreField, Pos, Orientation } from '@cloud-api/core-models';

export class Row {
    constructor(
        public fields: BattleField[]
    ) {
    }

    copy() {
        let fields: BattleField[];
        if (this.fields) {
            fields = this.fields.map((field: BattleField) => {
                return field.copy();
            });
        } else {
            fields = null;
        }
        const row = new Row(fields);
        return row;
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

    copy(): BattleField {
        const field = new BattleField({x: this.pos.x, y: this.pos.y}, this.status);
        field.shooting = this.shooting;
        return field;
    }
}

export class BattleBoard {
    constructor(
        public rows: Row[],
        public ships: BattleShip[],
        public canShoot: boolean
    ) {
    }

    copy() {
        let rows: Row[];
        if (this.rows) {
            rows = this.rows.map((row: Row) => {
                return row.copy();
            });
        } else {
            rows = null;
        }
        let ships: BattleShip[];
        if (this.ships) {
            ships = this.ships.map((ship: BattleShip) => {
                return ship.copy();
            });
        } else {
            ships = null;
        }
        const board = new BattleBoard(rows, ships, this.canShoot);
        return board;
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

    copy(): BattleShip {
        const ship: Ship = {
            pos: {x: this._ship.pos.x, y: this._ship.pos.y},
            length: this._ship.length,
            orientation: this._ship.orientation,
            design: this._ship.design,
            hits: [ ...this._ship.hits],
            isSunk: this._ship.isSunk
        };
        return new BattleShip(ship);
    }
}
