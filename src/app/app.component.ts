import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private _language: string;

    constructor(private router: Router, public authService: AuthService, private translate: TranslateService) {
        translate.addLangs(['en', 'de']);
        translate.setDefaultLang('en');
        this.language = 'en';
    }

    get language(): string {
        return this._language;
    }

    set language(language: string) {
        this._language = language;
        this.translate.use(language);
    }

    async onLogoutClicked() {
        this.authService.logout().then(() => {
            this.router.navigateByUrl('');
        }); // TODO: catch + snackbar
    }
}
