import { FieldStatus, Ship, Field as CoreField, Pos, PlayerStatus } from '@cloud-api/core-models';

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

    get isShooting(): boolean {
        if (this.rows) {
            for (const row of this.rows) {
                if (row.fields) {
                    for (const field of row.fields) {
                        if (field.shooting) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}

export class BattleState {
    constructor(public status: PlayerStatus, public errorCode: string) {
    }
}
