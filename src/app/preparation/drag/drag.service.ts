import { Injectable } from '@angular/core';
import { PreparationService } from '../preparation.service';
import { Ship } from '../../shared/ship';
import { YardService } from '../yard.service';

@Injectable()
export class DragService {
    private _x: number;
    private _y: number;
    private _key: string;

    constructor(
        private yardService: YardService,
        private preparationService: PreparationService
    ) {
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    start(key: string) {
        this._key = key;
    }

    canDropDraggable(x: number, y: number): boolean {
        const b: boolean = (this._key !== null && this._x === x && this._y === y);
        return b;
    }

    enterDropTarget(x: number, y: number): boolean {
        if (this._key !== null) {
            if (this.preparationService.canAddShip(this._key, x, y)) {
                this._x = x;
                this._y = y;
                return true;
            }
        }
        return false;
    }

    leaveDropTarget(x: number, y: number): boolean {
        if (this._key !== null && this._x === x && this._y === y) {
            this._x = -1;
            this._y = -1;
            return true;
        }
        return false;
    }

    dropDraggable(x: number, y: number): string {
        if (this._key !== null && this._x === x && this._y === y) {
            if (this.drop(this._key, x, y)) {
                this._x = -1;
                this._y = -1;
                const key = this._key;
                this._key = null;
                return key;
            }
        }
        return null;
    }

    private drop(key: string, x: number, y: number): boolean {
        if (this.preparationService.canAddShip(key, x, y)) {
            let ship: Ship = this.yardService.removeShip(key);
            if (ship === null) {
                ship = this.preparationService.removeShip(key);
            }
            if (ship !== null) {
                this.preparationService.addShip(ship, x, y);
                return true;
            }
        }
        return false;
    }
}
