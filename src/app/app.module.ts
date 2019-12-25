import { NgModule } from '@angular/core';

// import only once (must not be part of SharedModule)!
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, FUNCTIONS_REGION } from '@angular/fire/functions';

import { SharedModule, createTranslateLoader } from './shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Feature Modules
import { AuthModule } from './auth/auth.module';
import { LanguageModule } from './language/language.module';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { BackendModule } from './backend/backend.module';
import { GameModule } from './game/game.module';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
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
        NgxsModule.forRoot(
            [],
            { developmentMode: !environment.production },
        ),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production,
        }),
        AppRoutingModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireFunctionsModule,

        AuthModule,
        LanguageModule,
        BackendModule,
        GameModule
    ],
    providers: [
        { provide: FUNCTIONS_REGION, useValue: 'europe-west2' }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
