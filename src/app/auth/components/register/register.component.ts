import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth.service';
import { AuthRedirectService } from '../../auth-redirect.service';
import { NotificationService } from '../../../shared/notification.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';

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
        private redirect: AuthRedirectService,
        private notification: NotificationService,
        private cloudFunctions: CloudFunctionsService
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
                this.cloudFunctions.updateUser({
                    displayName: this.displayName.value,
                    email: this.username.value,
                    avatarFileName: null
                })
                    .toPromise()
                    .then(() => {
                        this.waiting = false;
                        const msg = this.translate.instant('auth.register.successMessage');
                        this.notification.quickToast(msg, 2000);
                        this.redirect.redirectToNext('/user');
                    });
            })
            .catch(error => {
                this.waiting = false;
                const errorMsg = this.translate.instant('common.error.genericError'); // TODO
                this.notification.toastToConfirm(errorMsg);
            })
            ;
    }

    onCancel() {
        this.location.back();
    }

}
