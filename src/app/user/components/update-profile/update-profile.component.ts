import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { RedirectService } from 'src/app/auth/redirect.service';
import { NotificationService } from 'src/app/auth/notification.service';
import { UserService } from '../../user.service';

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
        private location: Location,
        private translate: TranslateService,
        private userService: UserService,
        private redirect: RedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        const userData = this.userService.authUser$.getValue();
        this.displayName.setValue(userData.displayName);
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
                this.redirect.redirectToNext('/user');
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
