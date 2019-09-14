import { Injectable } from '@angular/core';

@Injectable()
export class PreparationService {
    private _isChanged = false;

    get isChanged(): boolean {
        return this._isChanged;
    }

    reset() {
        this._isChanged = false;
    }

    change() {
        this._isChanged = true;
    }
}
