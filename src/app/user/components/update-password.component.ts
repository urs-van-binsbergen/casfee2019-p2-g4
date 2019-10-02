import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { NotificationService } from 'src/app/auth/notification.service';
import { RedirectService } from 'src/app/auth/redirect.service';

@Component({
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent {
    oldPassword = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    passwordRepeat = new FormControl('', [Validators.required]);
    form = new FormGroup({
        oldPassword: this.oldPassword,
        password: this.password,
        passwordRepeat: this.passwordRepeat
    });

    waiting = false;

    constructor(
        private location: Location,
        private translate: TranslateService,
        private authStateService: AuthStateService,
        private redirect: RedirectService,
        private notification: NotificationService,
    ) { }

    async onSubmit() {
        if (this.form.valid &&
            this.password.value !== this.passwordRepeat.value
        ) {
            this.passwordRepeat.setErrors({ mismatch: true });
        }
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;

        // Set display name
        this.authStateService.updatePassword(this.oldPassword.value, this.password.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('user.updatePassword.successMessage');
                this.notification.quickToast(msg, 2000);
                this.redirect.redirectToNext('/user');
            })
            .catch((error) => {
                this.waiting = false;
                const errorDetail = this.notification.localizeFirebaseError(error);
                this.notification.confirmToast(errorDetail);
            })
            ;
    }

    onCancel() {
        this.location.back();
    }
}