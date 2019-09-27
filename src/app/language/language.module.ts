import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from './language.component';
import { LanguageService } from './language.service';

@NgModule({
    declarations: [
        LanguageComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LanguageComponent
    ],
    providers: [
        LanguageService
    ]
})
export class LanguageModule { }
