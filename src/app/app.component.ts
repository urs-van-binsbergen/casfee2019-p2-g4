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

    private _languge: string;

    constructor(private router: Router, public authService: AuthService, private translate: TranslateService) {
        translate.addLangs(['en', 'de']);
        translate.setDefaultLang('en');
        this.languge = 'en';
    }

    get languge(): string {
        return this._languge;
    }

    set languge(languge: string) {
        this._languge = languge;
        this.translate.use(languge);
    }

    async onLogoutClicked() {
        await this.authService.logout();
        this.router.navigateByUrl('');
    }
}
