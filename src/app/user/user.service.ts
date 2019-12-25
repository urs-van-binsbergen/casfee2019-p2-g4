import { Injectable } from '@angular/core';
import { CloudDataService } from '../backend/cloud-data.service';
import { CloudFunctionsService } from '../backend/cloud-functions.service';
import { AuthService, AuthUser } from '../auth/auth.service';
import { BehaviorSubject, Subscription, Observable, pipe } from 'rxjs';
import { User } from '@cloud-api/core-models';
import { Store } from '@ngxs/store';
import { AuthState } from '../auth/state/auth.state';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserService {

    private dataSubscription: Subscription;
    private subscribedUid: string;

    userData$: BehaviorSubject<User>;

    constructor(
        private authService: AuthService,
        private store: Store,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService
    ) {
        this.userData$ = new BehaviorSubject(null);

        this.store.select(AuthState.authUser).subscribe(authUser => {
            if (!authUser) {
                this.unsubscribeData();
            } else {
                this.subscribeData(authUser.uid);
            }
        });
    }

    public updateProfile(displayName: string): Promise<void> {
        const userData = this.userData$.getValue();
        return this.authService.updateProfile(displayName)
            .then(() => {
                this.cloudFunctions.updateUser({
                    displayName,
                    avatarFileName: userData.avatarFileName,
                    email: userData.email
                })
                    .toPromise()
                    .then(() => {
                        // optimistic update (not awaiting update from database)
                        this.userData$.next({
                            ...userData,
                            displayName
                        });
                    });
            });
    }

    private subscribeData(uid: string) {
        if (this.dataSubscription) {
            // we are already subscribed
            if (this.subscribedUid !== uid) {
                // .. however to a different uid -> unsubscribe and resubscribe thereafter
                this.dataSubscription.unsubscribe();
            } else {
                return;
            }
        }

        this.dataSubscription = this.cloudData.getUser$(uid).subscribe(
            userData => {
                this.userData$.next(userData);
            });
    }

    private unsubscribeData() {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
            this.dataSubscription = null;
        }
        this.userData$.next(null);
    }

}
