import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from '../redirect.service';
import { NotificationService } from '../notification.service';

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
        private translate: TranslateService,
        private authService: AuthService,
        private redirect: RedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
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
                this.notification.quickToast(msg, 1000);
                this.redirect.redirectToNext('/user');
            })
            .catch(error => {
                this.waiting = false;

                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('auth.login.apiError', { errorDetail });
                this.notification.toastToConfirm(msg);
            });
    }
}