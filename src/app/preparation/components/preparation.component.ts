import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudFunctionsService } from '../../backend/cloud-functions.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PreparationArgs } from '@cloud-api/arguments';
import { PreparationInteractionService } from '../preparation-interaction.service';
import { PreparationService } from '../preparation.service';
import { PreparationDrop, PreparationRow, PreparationShip, boardHeight, boardWidth } from '../preparation-models';
import * as PreparationMethods from '../preparation-methods';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-preparation',
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit, OnDestroy {

    private _yard: PreparationShip[];
    private _preparation: PreparationShip[];
    private _board: PreparationRow[];
    private _isValid: boolean;
    private _isChanged: boolean;
    private _waiting: boolean;

    constructor(
        public dialog: MatDialog,
        private preparationInteractionService: PreparationInteractionService,
        private preparationService: PreparationService,
        private cloudFunctions: CloudFunctionsService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
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
            this._preparation = PreparationMethods.reducePreparationWithDrop(this._preparation, drop, this._yard);
            this._yard = PreparationMethods.reduceYardWithDrop(this._yard, drop);
            this._isValid = PreparationMethods.reduceValidWithPreparation(this._isValid, this._preparation);
            this._isChanged = true;
        });
        this.preparationInteractionService.rotate$.subscribe((key: number) => {
            this._preparation = PreparationMethods.reducePreparationWithRotation(this._preparation, key);
            this._isValid = PreparationMethods.reduceValidWithPreparation(this._isValid, this._preparation);
            this._isChanged = true;
        });
    }

    ngOnDestroy(): void {
        this.hideError();
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
        this._waiting = true;
        this.hideError();
        const ships = PreparationMethods.createShips(this._preparation);
        const args: PreparationArgs = {
            size: { w: boardWidth, h: boardHeight },
            ships: [...ships]
        };
        this.cloudFunctions.addPreparation(args).subscribe(
            results => {
                this._waiting = false;
                this.hideError();
            },
            error => {
                this._waiting = false;
                this.showError('preparation.error');
            },
            () => {
                this._waiting = false;
                this.hideError();
            }
        );
    }

    private hideError() {
        this.snackBar.dismiss();
    }

    private showError(error: string) {
        const message = this.translate.instant(error);
        const close = this.translate.instant('button.close');
        this.snackBar.open(message, close);
    }

}
