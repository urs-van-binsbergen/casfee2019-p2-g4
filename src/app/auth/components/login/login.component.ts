import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthRedirectService } from '../../auth-redirect.service';
import { Login } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

    // Form definition
    username = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required]);
    form = new FormGroup({
        username: this.username,
        password: this.password,
    });

    waiting = false;
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private translate: TranslateService,
        private redirect: AuthRedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        this.store.select(AuthState.login)
            .pipe(
                takeUntil(this.destroy$),
                tap(loginModel => {
                    if (loginModel === undefined) {
                        this.waiting = false;
                        return;
                    }

                    if (loginModel.success === undefined) {
                        this.waiting = true;
                        return;
                    }

                    if (loginModel.success) {
                        const msg = this.translate.instant('auth.login.successMessage');
                        this.notification.quickToast(msg, 1000);
                        this.redirect.redirectToNext('/user');
                        return;
                    }

                    const errorMessage = loginModel.badCredentials ?
                        this.translate.instant('auth.login.error.badCredentials') :
                        loginModel.genericError;
                    this.notification.toastToConfirm(errorMessage);
                })
            )
            .subscribe();
    }

    onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.store.dispatch(new Login(this.username.value, this.password.value));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
