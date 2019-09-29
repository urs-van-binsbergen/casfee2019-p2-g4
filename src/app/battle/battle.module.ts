import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { BattleComponent } from './battle.component';

const routes: Routes = [{
    path: '',
    component: BattleComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        BattleComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class BattleModule { }
