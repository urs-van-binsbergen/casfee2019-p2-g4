import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatDivider, MatDividerModule } from '@angular/material';

import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from '../auth/login.component';
import { RegisterComponent } from './register.component';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ResetPasswordComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        TranslateModule,
    ],
    providers: [
        AuthService,
        AuthGuard
    ]
})
export class AuthModule {
}
