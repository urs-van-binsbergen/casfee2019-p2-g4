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

    constructor(private router: Router, public authService: AuthService, translate: TranslateService) {
        translate.addLangs(['en', 'de']);
        translate.setDefaultLang('en');
        translate.use('en');
    }

    async onLogoutClicked() {
        await this.authService.logout();
        this.router.navigateByUrl('');
    }
}
