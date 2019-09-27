import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageModule } from './language/language.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatButtonModule, MatMenuModule, MatCardModule, MatRadioModule } from '@angular/material';
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
import { MiniGameModule } from './mini-game/mini-game.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireFunctionsModule,

        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        LanguageModule,

        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        MatRadioModule,

        AdminModule,
        AuthModule,
        BattleModule,
        HallModule,
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
