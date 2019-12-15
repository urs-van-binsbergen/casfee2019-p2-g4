import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { RedirectService } from '../redirect.service';
import { NotificationService } from '../notification.service';

@Component({
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {

    email = new FormControl('', [Validators.required, Validators.email]);
    form = new FormGroup({
        email: this.email,
    });
    waiting = false;

    constructor(
        private translate: TranslateService,
        private authService: AuthService,
        private redirect: RedirectService,
        private notification: NotificationService,
        private location: Location,
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;
        this.authService.sendPasswordMail(this.email.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.resetPassword.successMessage');
                this.notification.quickToast(msg, 1000);
                this.redirect.redirectToNext('/user');
            })
            .catch(error => {
                this.waiting = false;

                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('auth.resetPassword.apiError', { errorDetail });
                this.notification.toastToConfirm(msg);
            });
    }

    onCancel() {
        this.location.back();
    }

}
