import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { IndexComponent } from './index.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/hall', pathMatch: 'full' },
    { path: 'index', component: IndexComponent },

    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule),
    },
    {
        path: 'battle',
        loadChildren: () => import('./battle/battle.module').then(x => x.BattleModule),
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
        path: 'mini-game',
        loadChildren: () => import('./mini-game/mini-game.module').then(x => x.MiniGameModule),
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

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
