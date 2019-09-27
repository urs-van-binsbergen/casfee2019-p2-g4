import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LanguageComponent } from './language.component';
import { LanguageService } from './language.service';

@NgModule({
    declarations: [
        LanguageComponent
    ],
    imports: [
        SharedModule
    ],
    exports: [
        LanguageComponent
    ],
    providers: [
        LanguageService
    ]
})
export class LanguageModule { }
