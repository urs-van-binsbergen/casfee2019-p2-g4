export interface DropDelegate {
    canDropDraggable(key: string, x: number, y: number): boolean;
    enterDropTarget(x: number, y: number): void;
    leaveDropTarget(x: number, y: number): void;
    dropDraggable(key: string, x: number, y: number): boolean;
}
