export interface DropDelegate {
    canDropDraggable(key: string, x: number, y: number): boolean;
    dropDraggable(key: string, x: number, y: number): boolean;
}
