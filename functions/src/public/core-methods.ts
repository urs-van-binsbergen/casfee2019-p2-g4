import { Size, Pos, Field, Ship, TargetField, Board } from './core-models';

export function areEqualPos(pos1: Pos, pos2: Pos): boolean {
    return pos1.x === pos2.x &&
        pos1.y === pos2.y;
}

export function areEqualSize(size1: Size, size2: Size): boolean {
    return size1.h === size2.h &&
        size1.w === size2.w;
}

export function findFieldByPos(fields: Field[][], pos: Pos): Field {
    return fields[pos.x][pos.y];
}

export function findTargetFieldByPos(fields: TargetField[][], pos: Pos): TargetField {
    return fields[pos.x][pos.y];
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
    // TODO: outsource geometry stuff to some library
    const fields: Field[][] = [];
    for (let x = 0; x < size.w; x++) {
        fields[x] = [];
        for (let y = 0; y < size.h; y++) {
            fields[x][y] = {
                pos: { x, y },
                isHit: false
            };
        }
    }

    return {
        size,
        ships,
        fields,
    };
}
