import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { BattleComponent } from './components/battle.component';
import { BattleFieldComponent } from './components/battle-field.component';
import { OwnBoardComponent } from './components/own-board.component';
import { TargetBoardComponent } from './components/target-board.component';

const routes: Routes = [{
    path: '',
    component: BattleComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        BattleComponent,
        BattleFieldComponent,
        OwnBoardComponent,
        TargetBoardComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class BattleModule { }
