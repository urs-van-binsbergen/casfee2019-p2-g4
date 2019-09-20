import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DialogModule } from '../dialog/dialog.module';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationGuard } from './preparation.guard';

@NgModule({
    declarations: [
        PreparationComponent
    ],
    imports: [
        BrowserModule,
        TranslateModule,
        MatButtonModule,
        MatCardModule,
        DialogModule
    ],
    providers: [
        PreparationService,
        PreparationGuard
    ]
})
export class PreparationModule { }
