import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { LoginComponent } from './auth/components/login.component';
import { RegisterComponent } from './auth/components/register.component';
import { ResetPasswordComponent } from './auth/components/reset-password.component';

const routes: Routes = [
    { path: '', redirectTo: '/hall', pathMatch: 'full' },

    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'auth',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
        ]
        // (AuthModule must be eagerly loaded, otherwise its AuthState has no change tracking in other modules)
    },
    {
        path: 'battle',
        loadChildren: () => import('./battle/battle.module').then(x => x.BattleModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'game',
        loadChildren: () => import('./game/game.module').then(x => x.GameModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'hall',
        loadChildren: () => import('./hall/hall.module').then(x => x.HallModule),
    },
    {
        path: 'match',
        loadChildren: () => import('./match/match.module').then(x => x.MatchModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'preparation',
        loadChildren: () => import('./preparation/preparation.module').then(x => x.PreparationModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(x => x.UserModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'victory',
        loadChildren: () => import('./victory/victory.module').then(x => x.VictoryModule)
    },
    {
        path: 'waterloo',
        loadChildren: () => import('./waterloo/waterloo.module').then(x => x.WaterlooModule)
    },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
