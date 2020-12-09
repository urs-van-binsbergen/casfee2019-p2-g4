import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreparationInteractionService } from '../services/preparation-interaction.service';
import { PreparationService } from '../services/preparation.service';
import { PreparationDrop, PreparationRow, PreparationShip, boardHeight, boardWidth } from '../model/preparation-models';
import * as PreparationMethods from '../model/preparation-methods';
import { Store } from '@ngxs/store';
import { AddPreparation } from '../state/preparation.actions';

@Component({
    selector: 'app-preparation',
    templateUrl: './preparation.component.html'
})
export class PreparationComponent implements OnInit, OnDestroy {

    private _yard: PreparationShip[];
    private _preparation: PreparationShip[];
    private _board: PreparationRow[];
    private _isValid: boolean;
    private _isChanged: boolean;
    private _waiting: boolean;

    constructor(
        private preparationInteractionService: PreparationInteractionService,
        private preparationService: PreparationService,
        private store: Store
    ) {
    }

    ngOnInit(): void {
        this._yard = this.preparationService.loadYard();
        this._preparation = [];
        this._board = this.preparationService.loadBoard(boardWidth, boardHeight);
        this._isValid = false;
        this._isChanged = false;
        this._waiting = false;
        this.preparationInteractionService.drop$.subscribe((drop: PreparationDrop) => {
            this._preparation = PreparationMethods.updatePreparationWithDrop(this._preparation, drop, this._yard);
            this._yard = PreparationMethods.updateYardWithDrop(this._yard, drop);
            this._isValid = PreparationMethods.updateValidWithPreparation(this._isValid, this._preparation);
            this._isChanged = true;
        });
        this.preparationInteractionService.rotate$.subscribe((key: number) => {
            this._preparation = PreparationMethods.updatePreparationWithRotation(this._preparation, key);
            this._isValid = PreparationMethods.updateValidWithPreparation(this._isValid, this._preparation);
            this._isChanged = true;
        });
    }

    ngOnDestroy(): void {
    }

    get yard(): PreparationShip[] {
        return this._yard;
    }

    get preparation(): PreparationShip[] {
        return this._preparation;
    }

    get rows(): PreparationRow[] {
        return this._board;
    }

    get enableDeactivationWarning(): boolean {
        return !this._waiting && this._isChanged;
    }

    get isContinueDisabled(): boolean {
        return !(this._isValid) || this._waiting;
    }

    get isWaiting(): boolean {
        return this._waiting;
    }

    onStart(event: any) {
        if (this.preparationInteractionService.onStart(event)) {
            event.preventDefault();
        }
    }

    onContinue(event: any) {
        if (this.preparationInteractionService.onContinue(event)) {
            event.preventDefault();
        }
    }

    onStop(event: any) {
        this.preparationInteractionService.onStop(event);
    }

    onContinueClicked() {
        const ships = PreparationMethods.createShips(this._preparation);
        this._waiting = true;
        this.store.dispatch(new AddPreparation(ships, boardWidth, boardHeight)).toPromise()
            .finally(() => {
                this._waiting = false;
            });
    }

}
