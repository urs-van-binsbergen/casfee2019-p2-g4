import { Component, OnInit } from '@angular/core';
import { CloudFunctionsService } from '../backend/cloud-functions.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PreparationArgs } from '@cloud-api/arguments';
import { PreparationInteractionService } from './preparation-interaction.service';
import { PreparationService } from './preparation.service';
import { PreparationDrop, PreparationRow, PreparationShip, boardHeight, boardWidth } from './preparation-models';
import * as PreparationMethods from './preparation-methods';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-preparation',
    templateUrl: './preparation.component.html',
    styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit {

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
        const ships = PreparationMethods.createShips(this._preparation);
        const args: PreparationArgs = {
            size: { w: boardWidth, h: boardHeight },
            ships: [...ships]
        };
        this.cloudFunctions.addPreparation(args).subscribe(
            results => {
                this._waiting = false;
            },
            error => {
                this.showError();
            },
            () => {
                this._waiting = false;
            }
        );
    }

    showError() {
        const message = this.translate.instant('preparation.error');
        const snackBarRef = this.snackBar.open(message, null, { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(() => {
            this._waiting = false;
        });
    }

}
