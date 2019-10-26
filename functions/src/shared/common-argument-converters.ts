import { Ship, Pos, Size } from '../public/core-models';
import { HttpsError } from 'firebase-functions/lib/providers/https';

// Convert from whatever the client sent to the required interface
// (common methods)

export function toPos(data: any): Pos {
    const x = parseNonNegativeNumber(data.x, 'x');
    const y = parseNonNegativeNumber(data.y, 'y');
    return { x, y };
}

export function toSize(data: any): Size {
    const w = parseNonNegativeNumber(data.w, 'w');
    const h = parseNonNegativeNumber(data.h, 'h');
    return { w, h };
}

export function toShip(data: any): Ship {
    const length = parseNonNegativeNumber(data.length, 'length');
    return {
        pos: toPos(data.pos),
        length,
        isVertical: !!data.isVertical,
        isSunk: false, // not to be set by client
        hits: [], // not to be set by client
    };
}

export function toMiniGameNumber(data: any): number {
    const number = parseNonNegativeNumber(data, 'miniGameNumber');
    if (number < 1 || number > 100) {
        throw new HttpsError('out-of-range', 'number from 1 to 100');
    }
    return number;
}

export function parseNonNegativeNumber(x: any, description: string): number {
    const num = parseInt(x, 10);
    if (num !== num || num < 0) {
        throw new HttpsError('out-of-range', `${description} must be a non-negative number (but is '${x}')`);
    }
    return num;
}

export function convertArray<TElement>(
    array: any,
    mapper: (el: any) => TElement, createError: () => Error
) {
    try {
        const tmp = Array.from(array, mapper);
        return tmp;
    } catch (error) {
        throw createError();
    }
}
