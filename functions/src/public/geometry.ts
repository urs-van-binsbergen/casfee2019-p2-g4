// Elementary geometry (shared with frontend)

export interface Pos {
    x: number;
    y: number;
}

export interface Size {
    w: number;
    h: number;
}

export enum Orientation {
    East = 0,
    South = 1,
    West = 2,
    North = 3
}

export interface Vector {
    origin: Pos;
    orientation: Orientation;
    length: number;
}

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
 * The target pos "B" of a vector
 */
export function getVectorTargetPos(vector: Vector): Pos {
    switch (vector.orientation) {
        case Orientation.East:
            return { ...vector.origin, x: vector.origin.x + vector.length };
        case Orientation.South:
            return { ...vector.origin, y: vector.origin.y + vector.length };
        case Orientation.West:
            return { ...vector.origin, x: vector.origin.x - vector.length };
        case Orientation.North:
            return { ...vector.origin, y: vector.origin.y - vector.length };
        default:
            throw new Error('argument out of range: orientation');
    }
}

/*
 * Slices a vector into the positions it includes
 */
export function sliceVector(vector: Vector): Pos[] {
    let origin = { ...vector.origin };
    const positions: Pos[] = [];
    for (const _ of new Array(vector.length)) {
        positions.push(origin);
        // move by one
        origin = getVectorTargetPos({ origin, orientation: vector.orientation, length: 1 });
    }
    return positions;
}
