import { Pos, Size, Orientation } from '../public/geometry';
import { Ship } from '../public/core-models';
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
        orientation: convertEnum<Orientation>(Orientation, data.orientation),
        design: parseNonNegativeNumber(data.design, 'design'),
        isSunk: false, // not to be set by client
        hits: [], // not to be set by client
    };
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

/*
 * Converts the numeric or string value to this enum type, throws
 * on out of range values.
 */
export function convertEnum<TEnum>(enumType: any, value: any): TEnum {
    const values = Object.values(enumType);
    if (values.includes(value)) {
        if (typeof value === 'string') {
            return enumType[value];
        }
        return value;
    }
    throw new HttpsError('out-of-range', `argument out of range <${values}>, actual is <${value}>)`);
}
