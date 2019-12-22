import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
        UpdatePasswordComponent
    ],
    imports: [
        SharedModule,
        RouterModule
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
