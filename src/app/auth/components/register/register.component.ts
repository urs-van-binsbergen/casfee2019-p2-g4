import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, tap, skip } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { NotificationService } from 'src/app/shared/notification.service';
import { Register } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';
import { AuthRedirectService } from '../../auth-redirect.service';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {

    // Form definition
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
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private location: Location,
        private translate: TranslateService,
        private redirect: AuthRedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        this.store.select(AuthState.registerResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(model => {
                    if (!model) {
                        return;
                    }

                    this.waiting = false;

                    if (model.success) {
                        if (model.incompleteSave) {
                            const msg = this.translate.instant('auth.register.error.incompleteSave');
                            this.notification.toastToConfirm(msg);
                        } else {
                            const msg = this.translate.instant('auth.register.successMessage');
                            this.notification.quickToast(msg, 1000);
                        }
                        this.redirect.redirectToNext('/user');
                        return;
                    }

                    // Error
                    let errorMsg: string;
                    if (model.emailInUse) {
                        errorMsg = this.translate.instant('auth.register.error.emailInUse');
                    } else if (model.invalidEmail) {
                        errorMsg = this.translate.instant('auth.register.error.invalidEmail');
                    } else {
                        errorMsg = this.translate.instant('common.error.genericError', { errorDetail: model.otherError });
                    }
                    this.notification.toastToConfirm(errorMsg);
                })
            )
            .subscribe();
    }

    onSubmit() {
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
        this.waiting = true;
        this.store.dispatch(new Register(this.username.value, this.password.value, this.displayName.value));
    }

    onCancel() {
        this.location.back();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }


}
