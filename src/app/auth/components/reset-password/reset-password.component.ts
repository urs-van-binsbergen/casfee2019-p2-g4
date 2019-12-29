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
                        const msg = this.translate.instant('auth.resetPassword.successMessage');
                        this.notification.quickToast(msg, 1000);
                        this.redirect.redirectToNext('/user');
                        return;
                    }

                    // Error
                    let errorMsg: string;
                    if (result.userNotFound) {
                        errorMsg = this.translate.instant('auth.resetPassword.error.userNotFound');
                    } else if (result.invalidEmail) {
                        errorMsg = this.translate.instant('auth.resetPassword.error.invalidEmail');
                    } else {
                        errorMsg = this.translate.instant('common.error.genericError', { errorDetail: result.otherError });
                    }
                    this.notification.toastToConfirm(errorMsg);
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
