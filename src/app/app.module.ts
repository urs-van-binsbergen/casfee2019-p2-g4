import { NgModule } from '@angular/core';

// import only once (must not be part of SharedModule)!
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';

import { SharedModule, createTranslateLoader } from './shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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
import { MiniGameModule } from './mini-game/mini-game.module';
import { UserModule } from './user/user.module';

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            isolate: false
        }),
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
        MiniGameModule,
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
