import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from './redirect-service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required])
    });
    waiting = false;

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private authService: AuthService,
        private redirect: RedirectService,
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        if (!this.loginForm.valid) {
            const invalidMsg = this.translate.instant('auth.login.pleaseCheckInput');
            this.snackBar.open(invalidMsg);
            return;
        }

        this.waiting = true;
        this.authService.login(
            this.loginForm.controls.username.value,
            this.loginForm.controls.password.value
        )
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.login.loginSuccess');
                this.snackBar.open(msg, null, { duration: 1000 });
                this.redirect.redirectToNext('/user');
            })
            .catch(error => {
                this.waiting = false;

                // Try to get a localized message for the error code
                const errDetKey = 'firebase.errorCodes.' + error.code;
                let errorDetail: string = this.translate.instant(errDetKey);
                // If not available: output the original api message
                if (errorDetail === errDetKey) {
                    errorDetail = `${error.message} (${error.code})`;
                }

                const msg = this.translate.instant('auth.login.loginFailure', { errorDetail });
                const close = this.translate.instant('button.close');
                this.snackBar.open(msg, close);
            });
    }
}
