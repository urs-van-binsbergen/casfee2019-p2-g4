import { FieldStatus, Ship, Size, Field as CoreField, FlatGrid, Pos } from '@cloud-api/core-models'
import { findFieldByPos } from '@cloud-api/core-methods';

export class Row {
    constructor(
        public fields: Field[]
    ) {

    }
}

export class Field implements CoreField {
    constructor(
        public pos: Pos,
        public status: FieldStatus
    ) {
    }

    shooting = false;

    get shootable(): boolean
    {
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

export function createRowsAndFields(grid: FlatGrid<CoreField>): Row[] {
    var rows: Row[] = [];
    const size = grid.size;
    for (let y = 0; y < size.h; y++) {
        const fields: Field[] = [];
        for (let x = 0; x < size.h; x++) {
            const pos = { x, y };
            const coreField = findFieldByPos(grid, pos);
            const field = new Field(coreField.pos, coreField.status);
            fields.push(field);
        }
        const row = new Row(fields);
        rows.push(row);
    }
    return rows;
}