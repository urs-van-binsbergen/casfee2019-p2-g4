import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VictoryComponent } from './victory.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        VictoryComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        VictoryComponent
    ]
})
export class VictoryModule { }
