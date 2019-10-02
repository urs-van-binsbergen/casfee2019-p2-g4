import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AuthStateService } from './auth/auth-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private _language: string;

    constructor(
        private router: Router,
        private authService: AuthService,
        public authState: AuthStateService
    ) {
    }

    async onLogoutClicked() {
        this.authService.logout().then(() => {
            this.router.navigateByUrl('');
        }); // TODO: catch + snackbar
    }
}
