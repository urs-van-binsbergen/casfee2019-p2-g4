import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { RedirectService } from './redirect-service';

@Component({
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    email = new FormControl('', [Validators.required, Validators.email]);
    form = new FormGroup({
        email: this.email,
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
        if (!this.form.valid) {
            const invalidMsg = this.translate.instant('common.message.pleaseCheckFormInput');
            this.snackBar.open(invalidMsg);
            return;
        }

        this.waiting = true;
        this.authService.sendPasswordMail(this.email.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.resetPassword.successMessage');
                const ok = this.translate.instant('button.ok');
                this.snackBar.open(msg, ok);
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

                const msg = this.translate.instant('auth.resetPassword.apiError', { errorDetail });
                const ok = this.translate.instant('button.ok');
                this.snackBar.open(msg, ok);
            });
    }

    onCancel() {
        this.location.back();
    }

}
