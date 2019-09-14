import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class ContinueCancelDialogData {
    public title: string;
    public body: string;
}

@Component({
    selector: 'continue-cancel-dialog',
    templateUrl: './continue-cancel-dialog.component.html',
    styleUrls: ['./continue-cancel-dialog.component.scss']
})
export class ContinueCancelDialogComponent {
    constructor(public dialogRef: MatDialogRef<ContinueCancelDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ContinueCancelDialogData) {
    }
}
