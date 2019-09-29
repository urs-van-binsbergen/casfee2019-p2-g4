import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { RedirectService } from '../redirect.service';
import { AuthStateService } from '../auth-state.service';
import { NotificationService } from '../notification.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
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
        private authStateService: AuthStateService,
        private redirect: RedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
    }

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

        // Register
        let userCredential: firebase.auth.UserCredential;
        try {
            userCredential = await this.authService.register(this.username.value,this.password.value)   
        } catch (error) {
            this.waiting = false;

            const errorDetail = this.notification.localizeFirebaseError(error);
            const msg = this.translate.instant('auth.register.apiError', { errorDetail });
            this.notification.confirmToast(msg);
            return;
        }

        // Set display name
        try {
            await this.authStateService.updateProfile(userCredential.user, this.displayName.value); 
        } catch(error) {
            const errorDetail = this.notification.localizeFirebaseError(error);
            this.notification.confirmToast(errorDetail); 
        }

        this.waiting = false;
        const msg = this.translate.instant('auth.register.successMessage');
        this.notification.quickToast(msg, 1000);
        this.redirect.redirectToNext('/user');

    }

    onCancel() {
        this.location.back();
    }

}
