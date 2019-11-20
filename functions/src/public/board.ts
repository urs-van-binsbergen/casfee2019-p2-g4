// Core methods (used server AND client side)

import { Size } from './geometry';
import * as FlatTable from './flat-table';
import { Ship, Board, Field, FieldStatus } from './core-models';

/*
 * Create a board of this size with these ships
 */
export function createBoard(size: Size, ships: Ship[]): Board {
    const table = FlatTable.createFromCellGenerator<Field>(size, pos => (
        { pos, status: FieldStatus.Unknown }
    ));

    return {
        size: table.size,
        fields: table.cells,
        ships: [...ships]
    };
}


