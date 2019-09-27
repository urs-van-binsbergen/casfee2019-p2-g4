import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HallComponent } from './hall.component';

@NgModule({
    declarations: [
        HallComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
    ]
})
export class HallModule { }
