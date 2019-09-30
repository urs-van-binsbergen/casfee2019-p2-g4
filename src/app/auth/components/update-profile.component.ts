import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RedirectService } from '../redirect.service';
import { AuthStateService } from '../auth-state.service';
import { NotificationService } from '../notification.service';

@Component({
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss']
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
        try {
            await this.authStateService.updateProfile(this.displayName.value); 
        } catch(error) {
            const errorDetail = this.notification.localizeFirebaseError(error);
            this.notification.confirmToast(errorDetail); 
        }

        this.waiting = false;
        const msg = this.translate.instant('auth.register.successMessage');
        this.notification.quickToast(msg, 1000);
        this.redirect.redirectToNext('/user');
    }

    onCancel() {
        this.location.back();
    }

}
