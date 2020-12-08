import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DialogModule } from '../dialog/dialog.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            isolate: false
        })
    ],
    exports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDividerModule,
        MatListModule,
        MatTableModule,
        TranslateModule,
        DialogModule
    ]
})
export class SharedModule { }
