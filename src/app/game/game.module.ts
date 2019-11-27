import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { GameComponent } from './components/game.component';
import { WaterlooModule } from '../waterloo/waterloo.module';
import { VictoryModule } from '../victory/victory.module';

const routes: Routes = [{
    path: '',
    component: GameComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        GameComponent
    ],
    imports: [
        RouterModule.forChild(routes), // (MUST stay before feature module imports)
        SharedModule,
        WaterlooModule,
        VictoryModule
    ]
})
export class GameModule { }

