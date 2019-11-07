// Elementary methods (used server AND client side)

import { Size, Pos, Ship, Board, FlatGrid, FieldStatus } from './core-models';

/*
 * Are these two positions equal?
 */
export function areEqualPos(pos1: Pos, pos2: Pos): boolean {
    return pos1.x === pos2.x &&
        pos1.y === pos2.y;
}

/*
 * Are these two sizes equal?
 */
export function areEqualSize(size1: Size, size2: Size): boolean {
    return size1.h === size2.h &&
        size1.w === size2.w;
}

export function getIndexFromPos(pos: Pos, size: Size) {
    return pos.y * size.w + pos.x;
}

export function getPosFromIndex(index: number, size: Size): Pos {
    const y = Math.floor(index / size.w);
    const x = index % size.w;
    return { x, y };
}

export function findFieldByPos<TField>(grid: FlatGrid<TField>, pos: Pos): TField {
    const index = getIndexFromPos(pos, grid.size);
    return grid.fields[index];
}

export function createFields<TField>(size: Size, createField: (pos: Pos) => TField): TField[] {
    const fields: TField[] = [];
    for (let y = 0; y < size.h; y++) {
        for (let x = 0; x < size.h; x++) {
            const pos = { x, y };
            const index = getIndexFromPos(pos, size);
            fields[index] = createField(pos);
        }
    }
    return fields;
}

export interface ShipFindResult {
    ship: Ship;

    /*  Index of the field being matched by the find argument (from top left point) */
    fieldIndex: number;
}

export function findShipByPos(ships: Ship[], pos: Pos): ShipFindResult | null {
    for (const ship of ships) {
        const fieldIndex = getShipPositions(ship).findIndex(x => areEqualPos(x, pos));
        if (fieldIndex > -1) {
            return {
                ship,
                fieldIndex
            };
        }
    }
    return null;
}

function getShipPositions(ship: Ship): Pos[] {
    const positions: Pos[] = [];
    const x = ship.pos.x;
    const y = ship.pos.y;
    for (let index = 0; index < ship.length; index++) {
        const pos = ship.isVertical ?
            { x, y: y + index } :
            { x: x + index, y };
        positions.push(pos);
    }
    return positions;
}

export function createBoard(size: Size, ships: Ship[]): Board {
    const fields = createFields(size, pos => ({ pos, status: FieldStatus.Unknown }));

    return { size, ships, fields };
}
