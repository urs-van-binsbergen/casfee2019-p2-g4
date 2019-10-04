import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { ResetPasswordComponent } from './components/reset-password.component';
import { RedirectService } from './redirect.service';
import { AuthStateService } from './auth-state.service';
import { NotificationService } from './notification.service';


@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent,
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
