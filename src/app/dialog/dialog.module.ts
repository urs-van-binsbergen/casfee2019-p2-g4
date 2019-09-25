import { NgModule } from '@angular/core';
import { ContinueCancelDialogComponent } from './continue-cancel-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

@NgModule({
    declarations: [
        ContinueCancelDialogComponent
    ],
    imports: [
        TranslateModule,
        MatButtonModule,
        MatDialogModule
    ],
    entryComponents: [
        ContinueCancelDialogComponent
    ]
})
export class DialogModule {
}
