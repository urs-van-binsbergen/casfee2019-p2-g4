import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, tap, skip } from 'rxjs/operators';
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
        this.store.select(AuthState.updatePasswordResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(result => {
                    if (!result) {
                        return;
                    }

                    this.waiting = false;

                    if (result.success) {
                        this.notification.quickToast1('auth.updatePassword.successMessage');
                        this.redirect.redirectToNext('/user');
                        return;
                    } else {
                        const key = result.wrongPassword ?
                            'auth.updatePassword.error.wrongPassword' :
                            'common.error.genericError';
                        this.notification.errorToast(key, { errorDetail: result.otherError });
                    }
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
