import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService,
    ) {

    }

    quickToast1(key: string, interpolateParams?: object) {
        const msg = this.translate.instant(key, interpolateParams);
        this.snackBar.open(msg, null, { duration: 1000 });
    }

    quickToast2(key: string, interpolateParams?: object) {
        const msg = this.translate.instant(key, interpolateParams);
        this.snackBar.open(msg, null, { duration: 2000 });
    }

    errorToast(key: string, interpolateParams?: object) {
        const close = this.translate.instant('button.ok');
        const msg = this.translate.instant(key, interpolateParams);
        this.snackBar.open(msg, close);
    }

    quickErrorToast(key: string, interpolateParams?: object) {
        const msg = this.translate.instant(key, interpolateParams);
        this.snackBar.open(msg, null, { duration: 3000 });
    }

    pleaseCheckFormInput() {
        const msg = this.translate.instant('common.message.pleaseCheckFormInput');
        this.snackBar.open(msg, null, { duration: 1000 });
    }

}
