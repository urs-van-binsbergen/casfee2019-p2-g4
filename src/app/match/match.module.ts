import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './match.component';

@NgModule({
    declarations: [
        MatchComponent
    ],
    imports: [
        SharedModule
    ]
})
export class MatchModule { }
