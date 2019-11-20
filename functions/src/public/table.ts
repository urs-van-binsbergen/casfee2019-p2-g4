import { Size, Pos } from './geometry';

/*
 * A table which holds its cells in a 2d array
 */
export interface ITable<TCell> {
    size: Size;
    cells: TCell[][];
}

/*
 * Get cell at this position
 */
export function getCell<TCell>(table: ITable<TCell>, pos: Pos): TCell | undefined {
    const row = table.cells[pos.y];
    if (!row) {
        return undefined;
    }
    return row[pos.x];
}

/*
 * Create from a cell generator function
 */
export function createFromCellGenerator<TCell>(size: Size, generateCell: (pos: Pos) => TCell): ITable<TCell> {
    const cells: TCell[][] = [];
    for (let y = 0; y < size.h; y++) {
        cells[y] = [];
        for (let x = 0; x < size.w; x++) {
            const pos = { x, y };
            cells[y][x] = generateCell(pos);
        }
    }
    return { size: { ...size }, cells };
}
