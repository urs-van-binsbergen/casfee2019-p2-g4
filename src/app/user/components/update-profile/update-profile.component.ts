import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from '../../user.service';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Router } from '@angular/router';

@Component({
    templateUrl: './update-profile.component.html'
})
export class UpdateProfileComponent implements OnInit {

    displayName = new FormControl('', [Validators.required]);
    form = new FormGroup({
        displayName: this.displayName,
    });

    waiting = false;

    constructor(
        private store: Store,
        private location: Location,
        private translate: TranslateService,
        private userService: UserService,
        private router: Router,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        const displayName = this.store.selectSnapshot(AuthState.authUser).displayName;
        // TODO: use NGXS UserState (yet to be created)
        this.displayName.setValue(displayName);
    }

    async onSubmit() {
        if (!this.form.valid) {
            this.notification.pleaseCheckFormInput();
            return;
        }

        this.waiting = true;

        // Set display name
        this.userService.updateProfile(this.displayName.value)
            .then(() => {
                this.waiting = false;
                const msg = this.translate.instant('user.updateProfile.successMessage');
                this.notification.quickToast(msg, 2000);
                this.router.navigateByUrl('/user');
            })
            .catch(error => {
                this.waiting = false;
                const errorDetail = this.notification.localizeFirebaseError(error);
                this.notification.toastToConfirm(errorDetail);
            });

    }

    onCancel() {
        this.location.back();
    }

}
