import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth.service';
import { RedirectService } from '../../redirect.service';
import { NotificationService } from '../../notification.service';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    displayName = new FormControl('', [Validators.required]);
    username = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    passwordRepeat = new FormControl('', [Validators.required]);
    form = new FormGroup({
        displayName: this.displayName,
        username: this.username,
        password: this.password,
        passwordRepeat: this.passwordRepeat
    });

    waiting = false;

    constructor(
        private location: Location,
        private translate: TranslateService,
        private authService: AuthService,
        private redirect: RedirectService,
        private notification: NotificationService,
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
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;

        // Register
        this.authService.register(this.username.value, this.password.value, this.displayName.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('auth.register.successMessage');
                this.notification.quickToast(msg, 2000);
                this.redirect.redirectToNext('/user');
            })
            .catch(error => {
                this.waiting = false;
                const errorDetail = this.notification.localizeFirebaseError(error);
                const errorMsg = this.translate.instant('auth.register.apiError', { errorDetail });
                this.notification.toastToConfirm(errorMsg);
            })
            ;
    }

    onCancel() {
        this.location.back();
    }

}
