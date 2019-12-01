import { Injectable } from '@angular/core';
import { PreparationField, PreparationRow, PreparationShip, boardHeight, boardWidth } from './preparation-models';

@Injectable()
export class PreparationService {

    public loadYard(): PreparationShip[] {
        const x = -1;
        const y = -1;
        return [
            {
                key: 20,
                pos: {x: 0, y: 1},
                center: {x: 0, y: 1},
                centerVertical: 75,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [],
                isOk: false,
                isVertical: false,
                isDragging: false
            },
            {
                key: 30,
                pos: {x: 1, y: 0},
                center: {x: 1, y: 1},
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 0,
                positions: [],
                isOk: false,
                isVertical: false,
                isDragging: false
            },
            {
                key: 31,
                pos: {x: 2, y: 0},
                center: {x: 2, y: 1},
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 0,
                positions: [],
                isOk: false,
                isVertical: false,
                isDragging: false
            },
            {
                key: 40,
                pos: {x: 3, y: 0},
                center: {x: 3, y: 1},
                centerVertical: 37.5,
                centerHorizontal: 50,
                length: 4,
                rotation: 0,
                positions: [],
                isOk: false,
                isVertical: false,
                isDragging: false
            },
            {
                key: 41,
                pos: {x: 4, y: 0},
                center: {x: 4, y: 1},
                centerVertical: 37.5,
                centerHorizontal: 50,
                length: 4,
                rotation: 0,
                positions: [],
                isOk: false,
                isVertical: false,
                isDragging: false
            }
        ];
    }

    public loadBoard(): PreparationRow[] {
        const rows: PreparationRow[] = [];
        for (let y = 0; y < boardHeight; y++) {
            const fields: PreparationField[] = [];
            for (let x = 0; x < boardWidth; x++) {
                const field: PreparationField = {
                    pos: {x, y},
                    isEntered: false
                };
                fields.push(field);
            }
            const row: PreparationRow = {fields};
            rows.push(row);
        }
        return rows;
    }

}
