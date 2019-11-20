import { Size, Pos } from './geometry';
import * as Table from './table';

/*
 * Table which holds its cells in a flat list (instead of 2-dimensional array or similar)
 *     Q: What for? A: Firestore does not allow multidimensional arrays
 */
export interface IFlatTable<TCell> {
    size: Size;
    cells: TCell[];
}

function getCellIndex(pos: Pos, size: Size): number {
    return pos.y * size.w + pos.x;
}

/*
 * Get cell at this position
 */
export function getCell<TCell>(table: IFlatTable<TCell>, pos: Pos): TCell | undefined {
    const index = getCellIndex(pos, table.size);
    const cell = table.cells[index];
    return cell;
}

/*
 * Create from a normal Table
 */
export function createFromTable<TCell>(table: Table.ITable<TCell>): IFlatTable<TCell> {
    const size = table.size;
    const cells: TCell[] = [];
    for (let y = 0; y < size.h; y++) {
        for (let x = 0; x < size.w; x++) {
            const pos = { x, y };
            const index = getCellIndex(pos, size);
            cells[index] = table.cells[x][y];
        }
    }
    return { size: { ...size }, cells };
}

/*
 * Convert back to a normal table
 */
export function toTable<TCell>(flatTable: IFlatTable<TCell>): Table.ITable<TCell> {
    const size = flatTable.size;
    const cells: TCell[][] = [];
    for (let y = 0; y < size.h; y++) {
        cells[y] = [];
        for (let x = 0; x < size.w; x++) {
            const index = getCellIndex({ x, y }, size);
            cells[y][x] = flatTable.cells[index];
        }
    }
    return { size: { ...size }, cells };
}

/*
 * Create from a cell generator function
 */
export function createFromCellGenerator<TCell>(size: Size, generateCell: (pos: Pos) => TCell): IFlatTable<TCell> {
    const cells: TCell[] = [];
    for (let y = 0; y < size.h; y++) {
        for (let x = 0; x < size.w; x++) {
            const pos = { x, y };
            const index = getCellIndex(pos, size);
            cells[index] = generateCell(pos);
        }
    }
    return { size: { ...size }, cells };
}
