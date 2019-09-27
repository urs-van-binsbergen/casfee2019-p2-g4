import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ContinueCancelDialogComponent } from './continue-cancel-dialog.component';

@NgModule({
    declarations: [
        ContinueCancelDialogComponent
    ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        TranslateModule
    ],
    entryComponents: [
        ContinueCancelDialogComponent
    ]
})
export class DialogModule { }
