import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthRedirectService } from 'src/app/auth/auth-redirect.service';
import { UpdatePassword } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';

@Component({
    templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {

    // Form definition
    oldPassword = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    passwordRepeat = new FormControl('', [Validators.required]);
    form = new FormGroup({
        oldPassword: this.oldPassword,
        password: this.password,
        passwordRepeat: this.passwordRepeat
    });

    waiting = false;
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private location: Location,
        private translate: TranslateService,
        private redirect: AuthRedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit(): void {
        this.store.select(AuthState.updatePassword)
            .pipe(
                takeUntil(this.destroy$),
                tap(model => {
                    if (model === undefined) {
                        this.waiting = false;
                        return;
                    }

                    if (model.success === undefined) {
                        this.waiting = true;
                        return;
                    }

                    if (model.success) {
                        const msg = this.translate.instant('auth.updatePassword.successMessage');
                        this.notification.quickToast(msg, 1000);
                        this.redirect.redirectToNext('/user');
                        return;
                    }

                    let errorMsg: string;
                    if (model.wrongPassword) {
                        errorMsg = this.translate.instant('auth.updatePassword.error.wrongPassword');
                    } else {
                        errorMsg = this.translate.instant('common.error.genericError', { errorDetail: model.otherError });
                    }
                    this.notification.toastToConfirm(errorMsg);
                })
            )
            .subscribe();
    }

    async onSubmit() {
        // Form validation
        if (this.form.valid &&
            this.password.value !== this.passwordRepeat.value
        ) {
            this.passwordRepeat.setErrors({ mismatch: true });
        }
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        // Dispatch
        this.store.dispatch(new UpdatePassword(this.oldPassword.value, this.password.value));
    }

    onCancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
