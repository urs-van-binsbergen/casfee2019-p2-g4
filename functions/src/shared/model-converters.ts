import { Ship, Pos } from '../public/core-models';

export function toShip(data: any): Ship {
    const length = parsePositiveNumber(data.length, 'length');
    return {
        pos: toPos(data.pos),
        length,
        isVertical: !!data.isVertical,
        isSunk: false
    };
}

function toPos(data: any): Pos {
    const x = parsePositiveNumber(data.x, 'x');
    const y = parsePositiveNumber(data.y, 'y');
    return { x, y };
}

function parsePositiveNumber(x: any, description: string): number {
    const num = parseInt(x, 10);
    if (!num || num < 1) {
        throw new Error(`${description} must be a positive number`);
    }
    return num;
}
