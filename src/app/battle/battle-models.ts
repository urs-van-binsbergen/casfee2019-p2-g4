import { FieldStatus, Ship, Field as CoreField, Pos } from '@cloud-api/core-models';

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
        public ships: Ship[],
        public canShoot: boolean
    ) {

    }
}

