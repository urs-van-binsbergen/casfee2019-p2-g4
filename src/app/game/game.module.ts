import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { PlayerState } from './state/player.state';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { GameComponent } from './components/game/game.component';
import { WaterlooModule } from '../waterloo/waterloo.module';
import { VictoryModule } from '../victory/victory.module';
import { PreparationModule } from '../preparation/preparation.module';
import { MatchModule } from '../match/match.module';
import { BattleModule } from '../battle/battle.module';
import { GameDebugComponent } from './components/game-debug/game-debug.component';

const gameRoutes: Routes = [
    { path: '', component: GameComponent, canActivate: [AuthGuard] },
    { path: 'debug', component: GameDebugComponent, canActivate: [AuthGuard] },
];

@NgModule({
    declarations: [
        GameComponent,
        GameDebugComponent
    ],
    imports: [
        RouterModule.forChild(gameRoutes), // (MUST stay before feature module imports)
        NgxsModule.forFeature([PlayerState]),
        SharedModule,
        PreparationModule,
        MatchModule,
        BattleModule,
        WaterlooModule,
        VictoryModule
    ]
})
export class GameModule { }

