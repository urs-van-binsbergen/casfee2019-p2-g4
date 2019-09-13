import { NgModule } from '@angular/core';
import { ContinueCancelDialogComponent } from './continue-cancel-dialog.component';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
    declarations: [
        ContinueCancelDialogComponent
    ],
    imports: [
        MatButtonModule,
        MatDialogModule
    ],
    entryComponents: [
        ContinueCancelDialogComponent
    ]
})
export class DialogModule {
}
