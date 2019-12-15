import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import * as UserState from 'src/app/user/components/user/user.state';
import { NotificationService } from 'src/app/auth/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

    state: UserState.State;

    userSubscription: Subscription;
    subscribedUid: string;

    constructor(
        private authState: AuthStateService,
        private authService: AuthService,
        private cloudData: CloudDataService,
        private router: Router,
        private notification: NotificationService,
        private translate: TranslateService
    ) {

    }

    ngOnInit(): void {
        this.updateState(UserState.getInitialState());

        this.authState.isLoggedIn$.subscribe(isLoggedIn => {
            if (!isLoggedIn) {
                // Not authenticated
                this.updateState(UserState.updateWithUnauthenticatedState());
                this.unsubscribeData();
            } else {
                // Authenticated
                const authUser = this.authState.currentUser;
                this.updateState(UserState.updateWithAuthUser(this.state, authUser));
                this.subscribeData(authUser.uid);
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeData();
    }

    async logout() {
        this.unsubscribeData();
        this.authService.logout()
            .then(() => this.router.navigateByUrl('/'));
    }

    private updateState(state: UserState.State) {
        this.state = state;

        // Warnings are shown with only after a delay. Otherwise temporary mismatches
        // between auth and db state are flashing. An actual mismatch is an
        // anomaly so we do not care about the flash then.
        if (this.state.delayHandle) {
            setTimeout(() => {
                this.state = UserState.updateWithDelayCancel(this.state, state.delayHandle);
            }, 2000);
        }
    }

    private subscribeData(uid: string) {
        if (this.userSubscription) {
            if (this.subscribedUid !== uid) {
                // already subscribed, but to a different uid
                this.userSubscription.unsubscribe();
            } else {
                // already subscribed > ok
                return;
            }
        }
        this.userSubscription = this.cloudData.getUser$(uid).subscribe(
            user => {
                if (user) {
                    this.updateState(UserState.updateWithUserData(this.state, user));
                } else {
                    this.updateState(UserState.updateWithUserDataMissing(this.state));
                }
            },
            error => {
                this.updateState(UserState.updateWithUserDataLoadFailure(this.state));
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('user.profile.apiError.loading', { errorDetail });
                this.notification.quickToast(msg, 2000);
            }
        );

        Promise.all([
            this.cloudData.getHistoricBattlesOf(uid),
            this.cloudData.getHallEntries()
        ])
            .then(results => {
                const [battles, hallEntries] = results;
                this.updateState(UserState.updateWithHistoricBattles(this.state, battles, hallEntries));
            })
            .catch(error => {
                this.updateState(UserState.updateWithHistoricBattlesLoadFailure(this.state));
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('user.myBattleList.apiError.loading', { errorDetail });
                this.notification.quickToast(msg, 2000);
            })
            ;
    }

    private unsubscribeData() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
            this.userSubscription = null;
        }
    }

}
