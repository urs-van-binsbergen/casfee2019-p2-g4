import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './shared/page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/hall', pathMatch: 'full' },

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
        path: 'game',
        loadChildren: () => import('./game/game.module').then(x => x.GameModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'hall',
        loadChildren: () => import('./hall/hall.module').then(x => x.HallModule),
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(x => x.UserModule),
        canLoad: [AuthGuard]
    },

    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
