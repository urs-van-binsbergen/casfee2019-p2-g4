import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WaterlooComponent } from './waterloo.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        WaterlooComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        WaterlooComponent
    ]
})
export class WaterlooModule { }
