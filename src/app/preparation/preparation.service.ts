import { Injectable } from '@angular/core';

@Injectable()
export class PreparationService {
    private _isChanged = false;
    private _isValidated = false;

    get isChanged(): boolean {
        return this._isChanged;
    }

    get isValidated(): boolean {
        return this._isValidated;
    }

    reset() {
        this._isChanged = false;
        this._isValidated = false;
    }

    change() {
        this._isChanged = true;
    }

    validate() {
        this._isValidated = true;
    }
}
