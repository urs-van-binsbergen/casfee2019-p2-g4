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
        const close = this.translate.instant('button.close');
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

    /*
     * Get a formatted and localized message for a firebase error object
     */
    localizeFirebaseError(error: firebase.FirebaseError): string {
        if (!error) {
            return 'unknown error'; // ...as users love them
        }
        if (error.code === undefined || error.message === undefined) {
            return error.toString();
        }

        // Try to get a localized message for the error code
        const errDetKey = 'firebase.errorCodes.' + error.code;
        let errorDetail: string = this.translate.instant(errDetKey);

        // If not available: output the original api message
        if (errorDetail === errDetKey) {
            errorDetail = `${error.message} (${error.code})`;
        }

        return errorDetail;
    }

}
