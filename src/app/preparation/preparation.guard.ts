import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PreparationComponent } from './preparation.component';
import { ContinueCancelDialogComponent, ContinueCancelDialogData } from '../dialog/continue-cancel-dialog.component';

@Injectable()
export class PreparationGuard implements CanDeactivate<PreparationComponent> {

    canDeactivate(target: PreparationComponent) {
        if (target.isChanged) {
            const dialog: MatDialog = target.dialog;
            const data: ContinueCancelDialogData = new ContinueCancelDialogData();
            data.title = 'Warning';
            data.body = 'Your data will get lost!';
            const dialogRef: MatDialogRef<ContinueCancelDialogComponent> = dialog.open(ContinueCancelDialogComponent, {
                data
            });
            return dialogRef.afterClosed();
        }
        return true;
    }

}
