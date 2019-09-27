import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { RedirectService } from '../redirect.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    username = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    passwordRepeat = new FormControl('', [Validators.required]);
    form = new FormGroup({
        username: this.username,
        password: this.password,
        passwordRepeat: this.passwordRepeat
    });

    waiting = false;

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private authService: AuthService,
        private redirect: RedirectService,
        private location: Location,
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        if (this.form.valid &&
            this.password.value !== this.passwordRepeat.value
        ) {
            this.passwordRepeat.setErrors({ mismatch: true });
        }
        if (!this.form.valid) {
            const invalidMsg = this.translate.instant('common.message.pleaseCheckFormInput');
            this.snackBar.open(invalidMsg);
            return;
        }

        this.waiting = true;
        this.authService.register(
            this.username.value,
            this.password.value
        )
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.register.successMessage');
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

                const msg = this.translate.instant('auth.register.apiError', { errorDetail });
                const close = this.translate.instant('button.close');
                this.snackBar.open(msg, close);
            });
    }

    onCancel() {
        this.location.back();
    }

}
