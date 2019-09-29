import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { IndexComponent } from './index.component';
import { LoginComponent } from './auth/login.component';
import { HallComponent } from './hall/hall.component';
import { AuthGuard } from './auth/auth.guard';
import { UserComponent } from './user/user.component';
import { MatchComponent } from './match/match.component';
import { BattleComponent } from './battle/battle.component';

import { MiniGameComponent } from './mini-game/mini-game.component';
import { MiniBattleComponent } from './mini-game/mini-battle.component';
import { MiniMatchComponent } from './mini-game/mini-match.component';
import { MiniPrepComponent } from './mini-game/mini-prep.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { RegisterComponent } from './auth/register.component';

const routes: Routes = [
    { path: '', component: HallComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
    { path: 'battle', component: BattleComponent, canActivate: [AuthGuard] },
    { path: 'hall', component: HallComponent },
    { path: 'index', component: IndexComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    { path: 'match', component: MatchComponent, canActivate: [AuthGuard] },
    { path: 'preparation', loadChildren: './preparation/preparation.module#PreparationModule'},
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },

    { path: 'mini-game', component: MiniGameComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/battle', component: MiniBattleComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/match', component: MiniMatchComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/prep', component: MiniPrepComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
