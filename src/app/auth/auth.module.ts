import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from '../auth/login.component';
import { MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        BrowserModule,
        TranslateModule,
        FlexLayoutModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule
    ],
    providers: [
        AuthService,
        AuthGuard
    ]
})
export class AuthModule {
}
