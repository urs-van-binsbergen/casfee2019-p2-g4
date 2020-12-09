import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ContinueCancelDialogData {
    public title: string;
    public body: string;
}

@Component({
    templateUrl: './continue-cancel-dialog.component.html'
})
export class ContinueCancelDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ContinueCancelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ContinueCancelDialogData) {
    }
}
