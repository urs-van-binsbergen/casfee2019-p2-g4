import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatButtonModule, MatMenuModule, MatCardModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index.component';
import { environment } from '../environments/environment';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { HallModule } from './hall/hall.module';
import { PreparationModule } from './preparation/preparation.module';
import { MatchModule } from './match/match.module';
import { UserModule } from './user/user.module';
import { BattleModule } from './battle/battle.module';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,

        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,

        AdminModule,
        AuthModule,
        BattleModule,
        HallModule,
        MatchModule,
        PreparationModule,
        UserModule
    ],
    providers: [
        AngularFireAuthGuard,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
