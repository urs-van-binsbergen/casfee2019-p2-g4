import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { AdminComponent } from './admin.component';

@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FlexLayoutModule,
        MatCardModule
    ]
})
export class AdminModule { }
