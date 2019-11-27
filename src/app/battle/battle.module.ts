import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BattleComponent } from './components/battle.component';
import { BattleFieldComponent } from './components/battle-field.component';
import { OwnBoardComponent } from './components/own-board.component';
import { TargetBoardComponent } from './components/target-board.component';
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
