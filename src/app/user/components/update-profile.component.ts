import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from '../../auth/redirect.service';
import { AuthStateService } from '../../auth/auth-state.service';
import { NotificationService } from '../../auth/notification.service';
import { UserService } from '../user.service';

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
        private authStateService: AuthStateService,
        private userService: UserService,
        private redirect: RedirectService,
        private notification: NotificationService,
    ) { }

    ngOnInit() {
        this.displayName.setValue(this.authStateService.currentUser.displayName);
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
                const errorDetail = this.notification.localizeFirebaseError(error);
                this.notification.toastToConfirm(errorDetail);
            });

    }

    onCancel() {
        this.location.back();
    }

}
