import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfile } from 'src/app/auth/state/auth.actions';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthUser } from 'src/app/auth/auth.service';
import { takeUntil, tap, skip } from 'rxjs/operators';

@Component({
    templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit {

    // Form definition
    displayName = new FormControl('', [Validators.required]);
    form = new FormGroup({
        displayName: this.displayName,
    });

    authUser: AuthUser;
    waiting = false;
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private location: Location,
        private translate: TranslateService,
        private router: Router,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        this.authUser = this.store.selectSnapshot(AuthState.authUser);
        if (!this.authUser) {
            this.router.navigateByUrl('/');
        }

        this.displayName.setValue(this.authUser.displayName);
        this.selectUpdateProfileResult();
    }

    private selectUpdateProfileResult() {
        this.store.select(AuthState.updateProfileResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(result => {
                    if (!result) {
                        return;
                    }

                    this.waiting = false;

                    if (result.success) {
                        if (!result.profileUpdateSuccess) {
                            this.notification.errorToast('user.updateProfile.error.incompleteSave');
                        } else {
                            this.notification.quickToast('user.updateProfile.successMessage');
                        }
                        this.router.navigateByUrl('/user');
                        return;
                    } else {
                        this.notification.errorToast('common.error.apiWriteError', { errorDetail: result.error });
                    }
                })
            ).subscribe();
    }

    async onSubmit() {
        if (!this.authUser) {
            this.router.navigateByUrl('/');
        }

        // Form validation
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        // Dispatch
        this.waiting = true;
        this.store.dispatch(new UpdateProfile(this.displayName.value, this.authUser.email));
    }

    onCancel() {
        this.location.back();
    }

}
