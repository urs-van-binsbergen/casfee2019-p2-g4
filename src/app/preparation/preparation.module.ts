import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PreparationComponent } from './preparation.component'
import { PreparationService } from './preparation.service';
import { PreparationGuard } from './preparation.guard';

@NgModule({
    declarations: [
        PreparationComponent
    ],
    imports: [
        BrowserModule,
        MatCardModule,
        MatButtonModule
    ],
    providers: [
        PreparationService,
        PreparationGuard
    ]
})
export class PreparationModule { }
