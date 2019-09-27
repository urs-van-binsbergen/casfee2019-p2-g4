import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';

import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index.component';
import { environment } from '../environments/environment';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { BattleModule } from './battle/battle.module';
import { HallModule } from './hall/hall.module';
import { LanguageModule } from './language/language.module';
import { MatchModule } from './match/match.module';
import { MiniGameModule } from './mini-game/mini-game.module';
import { PreparationModule } from './preparation/preparation.module';
import { UserModule } from './user/user.module';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent
    ],
    imports: [
        SharedModule,
        AppRoutingModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireFunctionsModule,

        AdminModule,
        AuthModule,
        BattleModule,
        HallModule,
        LanguageModule,
        MatchModule,
        MiniGameModule,
        PreparationModule,
        UserModule
    ],
    providers: [
        AngularFireAuthGuard,
        { provide: FUNCTIONS_REGION, useValue: 'europe-west2' }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
