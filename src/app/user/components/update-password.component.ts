import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/auth/notification.service';
import { RedirectService } from 'src/app/auth/redirect.service';
import { UserService } from '../user.service';

@Component({
    templateUrl: './update-password.component.html'
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
        private userService: UserService,
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
        this.userService.updatePassword(this.oldPassword.value, this.password.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('user.updatePassword.successMessage');
                this.notification.quickToast(msg, 2000);
                this.redirect.redirectToNext('/user');
            })
            .catch((error) => {
                this.waiting = false;
                const errorDetail = this.notification.localizeFirebaseError(error);
                this.notification.toastToConfirm(errorDetail);
            })
            ;
    }

    onCancel() {
        this.location.back();
    }
}
