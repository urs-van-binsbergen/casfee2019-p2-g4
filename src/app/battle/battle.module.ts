import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BattleComponent } from './components/battle.component';
import { BattleFieldComponent } from './components/field/battle-field.component';
import { OwnBoardComponent } from './components/own/own-board.component';
import { TargetBoardComponent } from './components/target/target-board.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        BattleComponent,
        BattleFieldComponent,
        OwnBoardComponent,
        TargetBoardComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        BattleComponent
    ]
})
export class BattleModule { }
