import { Injectable } from '@angular/core';
import { DropDelegate } from './drop.delegate';

@Injectable()
export class DragService {
    private _key: string;
    private _dropDelegate: DropDelegate;

    set dropDelegate(dropDelegate: DropDelegate) {
        this._dropDelegate = dropDelegate;
    }

    start(key: string) {
        this._key = key;
    }

    stop(key: string) {
        this._key = null;
    }

    canDropDraggable(x: number, y: number): boolean {
        if (this._key !== null) {
            return this._dropDelegate.canDropDraggable(this._key, x, y);
        }
        return false;
    }

    enterDropTarget(x: number, y: number) {
        this._dropDelegate.enterDropTarget(x, y);
    }

    leaveDropTarget(x: number, y: number) {
        this._dropDelegate.leaveDropTarget(x, y);
    }

    dropDraggable(x: number, y: number): string {
        if (this._key !== null) {
            if (this._dropDelegate.dropDraggable(this._key, x, y)) {
                return this._key;
            }
        }
        return null;
    }
}
