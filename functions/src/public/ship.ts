import * as FlatTable from './flat-table';
import * as Table from './table';
import { Ship } from './core-models';
import { Pos, Vector, Size, Orientation, areEqualPos, sliceVector } from './geometry';

export function createShip(pos: Pos, length: number, orientation: Orientation): Ship {
    return {
        pos: { ...pos },
        length,
        orientation,
        design: 0,
        hits: [],
        isSunk: false
    };
}

function shipToVector(ship: Ship): Vector {
    return {
        origin: { ...ship.pos },
        orientation: ship.orientation,
        length: ship.length
    };
}

function getPositionsCoveredByShip(ship: Ship): Pos[] {
    return sliceVector(shipToVector(ship));
}

/*
 * Find the ship covering this field position
 * - null for a water field
 * - when the field is covered by more than one ship, the first one of
 *   the list is returned
 */
export function findShipByPos(ships: Ship[], pos: Pos): { ship: Ship, fieldIndex: number } | null {
    for (const ship of ships) {
        const covered = getPositionsCoveredByShip(ship);
        const fieldIndex = covered.findIndex(x => areEqualPos(x, pos));
        if (fieldIndex > -1) {
            return {
                ship,
                fieldIndex
            };
        }
    }
    return null;
}

/*
 * Check rule conformity of ship layout (returns a description of the error if present)
 */
export function validateShipLayout(boardSize: Size, ships: Ship[]): string | null {
    const shipsTable = Table.createFromCellGenerator<Ship[]>(boardSize, () => []);

    // Fill the table, checking no ship is out of bound
    for (const ship of ships) {
        const covered = getPositionsCoveredByShip(ship);
        for (const pos of covered) {
            const shipsInCell = Table.getCell(shipsTable, pos);
            if (!shipsInCell) {
                return `The following ship is out of bounds at ${pos.x}/${pos.y}: ${JSON.stringify(ship)}`;
            }
            shipsInCell.push(ship);
        }
    }

    // Check no field is covered by more than one ship
    for (const shipsInCell of FlatTable.createFromTable(shipsTable).cells) {
        if (shipsInCell.length > 1) {
            return `Ship clash: ${JSON.stringify(shipsInCell)}`;
        }
    }

    return null;
}
