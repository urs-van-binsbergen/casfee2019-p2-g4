// Core methods (used server AND client side)

import { Size, Pos, Ship, Board, FlatGrid, FieldStatus, Orientation } from './core-models';


// ==== Basic Geometry

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

/*
 * Is the position with the size
 */
export function isPosInSize(pos: Pos, size: Size): boolean {
    return pos.x >= 0 && pos.y >= 0 && pos.x < size.w && pos.y < size.h;
}
/*
 * Gets the position after shifting by x steps in direction of orientation x
 */
export function shiftPos(origPos: Pos, orientation: Orientation, steps: number): Pos {
    switch (orientation) {
        case Orientation.East:
            return { ...origPos, x: origPos.x + steps };
        case Orientation.South:
            return { ...origPos, y: origPos.y + steps };
        case Orientation.West:
            return { ...origPos, x: origPos.x - steps };
        case Orientation.North:
            return { ...origPos, y: origPos.y - steps };
        default:
            throw new Error('argument out of range: orientation');
    }
}


// ==== Basic object creators

export function newPos(x: number, y: number): Pos {
    return { x, y };
}

export function newShip(pos: Pos, length: number, orientation: Orientation): Ship {
    return {
        pos: { ...pos },
        length,
        orientation,
        design: 0,
        hits: [],
        isSunk: false
    };
}

// ==== FlatGrid and Board (mapping 2d fields to a 1d array and vice versa)

const getIndexFromPos = (pos: Pos, size: Size) => pos.y * size.w + pos.x;

/*
 * Given a FlatGrid, find the field at this position
 */
export function findFieldByPos<TField>(grid: FlatGrid<TField>, pos: Pos): TField {
    const index = getIndexFromPos(pos, grid.size);
    return grid.fields[index];
}

/*
 * Create a board of this size with these ships
 */
export function createBoard(size: Size, ships: Ship[]): Board {
    const grid = createFlatGrid(size, pos => ({ pos, status: FieldStatus.Unknown }));

    return { size: grid.size, fields: grid.fields, ships: [...ships] };
}

/*
 * Create a FlatGrid of this size
 */
function createFlatGrid<TField>(size: Size, createField: (pos: Pos) => TField): FlatGrid<TField> {
    const fields: TField[] = [];
    for (let y = 0; y < size.h; y++) {
        for (let x = 0; x < size.w; x++) {
            const pos = { x, y };
            const index = getIndexFromPos(pos, size);
            fields[index] = createField(pos);
        }
    }
    return { size: { ...size }, fields };
}

/*
 * Create a 2d array of this size
 */
function createFields2dArray<TField>(size: Size, createField: (pos: Pos) => TField): TField[][] {
    const fields: TField[][] = [];
    for (let y = 0; y < size.h; y++) {
        fields[y] = [];
        for (let x = 0; x < size.w; x++) {
            const pos = { x, y };
            fields[y][x] = createField(pos);
        }
    }
    return fields;
}

/*
 * Flatten a fields 2d array
 */
function* flattenFields<TField>(fields: TField[][]): Iterable<TField> {
    for (const row of fields) {
        for (const field of row) {
            yield field;
        }
    }
}


// ==== Ship vs Pos

interface ShipFindResult {
    ship: Ship;

    /*  Index of the field being matched by the find argument (from top left point) */
    fieldIndex: number;
}

/*
 * Find the ship covering this field position
 * - null for a water field
 * - when the field is covered by more than one ship, the first one of
 *   the list is returned
 */
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

/*
 * Get positions (fields) covered by this ship
 */
export function getShipPositions(ship: Ship): Pos[] {
    let pos = { ...ship.pos };
    const positions: Pos[] = [];
    for (const _ of new Array(ship.length)) {
        positions.push(pos);
        pos = shiftPos(pos, ship.orientation, 1);
    }
    return positions;
}


// ==== Validation

export function fleetsHaveEqualLengths(fleet1: Ship[], fleet2: Ship[]): boolean {
    return JSON.stringify(fleet1.map(x => x.length).sort()) ===
        JSON.stringify(fleet2.map(x => x.length).sort());
}

export function isValidBoard(board: Board): boolean {
    const shipsByField = createFields2dArray<Ship[]>(board.size, (_) => []);

    // Check no ship is out of board
    for (const ship of board.ships) {
        for (const pos of getShipPositions(ship)) {
            if (!isPosInSize(pos, board.size)) {
                console.log('not in size', pos, board.size);
                return false;
            }
            shipsByField[pos.y][pos.x].push(ship);
        }
    }

    // Check no field is covered by more than one ship
    for (const ships of flattenFields(shipsByField)) {
        if (ships.length > 1) {
            console.log('clash', ships);
            return false;
        }
    }

    return true;
}
