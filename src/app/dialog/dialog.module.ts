import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MatCardModule } from '@angular/material';

@NgModule({
    declarations: [
        DialogComponent
    ],
    imports: [
        MatCardModule,
        MatDialogModule
    ],
    entryComponents: [
        DialogComponent
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
    ]
})
export class DialogModule {
}
