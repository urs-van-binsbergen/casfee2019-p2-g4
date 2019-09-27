import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BattleComponent } from './battle.component';

@NgModule({
    declarations: [
        BattleComponent
    ],
    imports: [
        SharedModule
    ]
})
export class BattleModule { }
