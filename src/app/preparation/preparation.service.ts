import { Injectable } from '@angular/core';
import { PreparationField, PreparationRow, PreparationShip, boardHeight, boardWidth } from './preparation-models';
import * as PreparationMethods from './preparation-methods';

@Injectable()
export class PreparationService {

    public loadYard(): PreparationShip[] {
        const x = -1;
        const y = -1;
        const centerVertical = 0;
        const centerHorizontal = 0;
        const rotation = 0;
        const isOk = false;
        const isVertical = false;
        const preparationShips = [
            {
                key: 20,
                pos: {x, y},
                center: {x: 0, y: 0},
                centerVertical,
                centerHorizontal,
                length: 2,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 30,
                pos: {x, y},
                center: {x: 1, y: 1},
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 31,
                pos: {x, y},
                center: {x: 2, y: 1},
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 40,
                pos: {x, y},
                center: {x: 3, y: 1},
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 41,
                pos: {x, y},
                center: {x: 4, y: 1},
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            }
        ];
        PreparationMethods.initPreparationShips(preparationShips);
        console.log('FUCK');
        return preparationShips;
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
