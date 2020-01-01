import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil, tap, skip } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthRedirectService } from '../../auth-redirect.service';
import { SendPasswordMail } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';

@Component({
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    // Form definition
    email = new FormControl('', [Validators.required, Validators.email]);
    form = new FormGroup({
        email: this.email,
    });

    waiting = false;
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private translate: TranslateService,
        private redirect: AuthRedirectService,
        private notification: NotificationService,
        private location: Location,
    ) { }

    ngOnInit() {
        this.store.select(AuthState.sendPasswordMailResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(result => {
                    if (!result) {
                        return;
                    }

                    this.waiting = false;

                    if (result.success) {
                        this.notification.quickToast('auth.resetPassword.successMessage');
                        this.redirect.redirectToNext('/user');
                        return;
                    } else {
                        let key: string;
                        if (result.userNotFound) {
                            key = 'auth.resetPassword.error.userNotFound';
                        } else if (result.invalidEmail) {
                            key = 'auth.resetPassword.error.invalidEmail';
                        } else {
                            key = 'common.error.genericError';
                        }
                        this.notification.errorToast(key, { errorDetail: result.otherError });
                    }
                })
            )
            .subscribe();
    }

    onSubmit() {
        // Form validation
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        // Dispatch
        this.waiting = true;
        this.store.dispatch(new SendPasswordMail(this.email.value));
    }

    onCancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
