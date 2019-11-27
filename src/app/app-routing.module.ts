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
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
