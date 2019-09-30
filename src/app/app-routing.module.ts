import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';
import { LoginComponent } from './auth/components/login.component';
import { AuthGuard } from './auth/auth.guard';

import { MiniGameComponent } from './mini-game/mini-game.component';
import { MiniBattleComponent } from './mini-game/mini-battle.component';
import { MiniMatchComponent } from './mini-game/mini-match.component';
import { MiniPrepComponent } from './mini-game/mini-prep.component';
import { ResetPasswordComponent } from './auth/components/reset-password.component';
import { RegisterComponent } from './auth/components/register.component';
import { UpdateProfileComponent } from './auth/components/update-profile.component';

const routes: Routes = [
    { path: 'index', component: IndexComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthGuard] },

    { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
    { path: 'battle', loadChildren: './battle/battle.module#BattleModule' },
    { path: 'hall', loadChildren: './hall/hall.module#HallModule' },
    { path: 'match', loadChildren: './match/match.module#MatchModule' },
    { path: 'preparation', loadChildren: './preparation/preparation.module#PreparationModule'},
    { path: 'user', loadChildren: './user/user.module#UserModule' },

    { path: 'mini-game', component: MiniGameComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/battle', component: MiniBattleComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/match', component: MiniMatchComponent, canActivate: [AuthGuard] },
    { path: 'mini-game/prep', component: MiniPrepComponent, canActivate: [AuthGuard] },

    { path: '**', redirectTo: 'hall' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
