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

    username = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required]);
    form = new FormGroup({
        username: this.username,
        password: this.password,
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
        if (!this.form.valid) {
            const invalidMsg = this.translate.instant('common.message.pleaseCheckFormInput');
            this.snackBar.open(invalidMsg);
            return;
        }

        this.waiting = true;
        this.authService.login(
            this.username.value,
            this.password.value
        )
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.login.successMessage');
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
