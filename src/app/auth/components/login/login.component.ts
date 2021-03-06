import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, skip } from 'rxjs/operators';
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
        this.store.select(AuthState.loginResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(result => {
                    if (!result) {
                        return;
                    }

                    this.waiting = false;

                    if (result.success) {
                        this.notification.quickToast1('auth.login.successMessage');
                        this.redirect.redirectToNext('/user');
                        return;
                    } else {
                        const key = result.badCredentials ?
                            'auth.login.error.badCredentials' :
                            'common.error.genericError';
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
        this.store.dispatch(new Login(this.username.value, this.password.value));
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
