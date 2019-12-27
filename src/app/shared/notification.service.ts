import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService,
    ) {

    }

    /*
     * Snackbar-toast which has to be confirmed with 'OK'
     */
    toastToConfirm(msg: string) {
        const close = this.translate.instant('button.ok');
        this.snackBar.open(msg, close);
    }

    /*
     * Snackbar-toast which auto-disappears
     */
    quickToast(msg: string, duration: number) {
        this.snackBar.open(msg, null, { duration });
    }

    /*
     * Snackbar-toast 'please check format', auto-disappearing
     */
    pleaseCheckFormInput() {
        const invalidMsg = this.translate.instant('common.message.pleaseCheckFormInput');
        this.quickToast(invalidMsg, 1000);
    }

    quickErrorToast(key: string) {
        const msg = this.translate.instant(key);
        this.quickToast(msg, 3000);
    }
}
