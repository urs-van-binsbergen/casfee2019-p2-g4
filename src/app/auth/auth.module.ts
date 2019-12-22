import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RedirectService } from './redirect.service';
import { AuthStateService } from './auth-state.service';
import { NotificationService } from './notification.service';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './state/auth.state';

const authRoutes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'update-password', component: UpdatePasswordComponent },
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        UpdatePasswordComponent
    ],
    imports: [
        RouterModule.forChild(authRoutes), // (MUST stay before feature module imports)
        SharedModule,
        RouterModule,
        NgxsModule.forFeature([AuthState])
    ],
    providers: [
        AuthService,
        AuthStateService,
        AuthGuard,
        RedirectService,
        NotificationService
    ]
})
export class AuthModule {
}
