import { Pos } from '@cloud-api/geometry';

export const boardWidth = 8;
export const boardHeight = 8;
export const numberOfShips = 5;

export interface PreparationShip {
    key: number;
    pos: Pos;
    center: Pos;
    centerVertical: number;
    centerHorizontal: number;
    length: number;
    rotation: number;
    positions: Pos[];
    isOk: boolean;
    isVertical: boolean;
    isDragging: boolean;
}

export interface PreparationField {
    pos: Pos;
    isEntered: boolean;
}

export interface PreparationRow {
    fields: PreparationField[];
}

export interface PreparationDrop {
    key: number;
    pos: Pos;
}
