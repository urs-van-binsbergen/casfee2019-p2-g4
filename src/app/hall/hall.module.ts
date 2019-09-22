import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HallComponent } from './hall.component';

@NgModule({
    declarations: [
        HallComponent
    ],
    imports: [
        BrowserModule,
        TranslateModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule
    ],
    providers: [
    ]
})
export class HallModule { }
