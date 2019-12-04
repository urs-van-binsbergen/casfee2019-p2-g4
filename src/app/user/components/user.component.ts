import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { User, PlayerLevel } from '@cloud-api/core-models';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import * as UserState from 'src/app/user/components/user.state';

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
        private router: Router
    ) {

    }

    ngOnInit() {
        this.updateState(UserState.getInitialState());

        this.authState.isLoggedIn$.subscribe(isLoggedIn => {
            if (!isLoggedIn) {
                // Not authenticated
                this.updateState(UserState.reduceWithUnauthenticedState());
                this.unsubscribeUserData();
            } else {
                // Authenticated
                const authUser = this.authState.currentUser;
                this.updateState(UserState.reduceWithAuthUser(this.state, authUser));
                this.subscribeUserData(authUser.uid);
            }
        });
    }

    private subscribeUserData(uid: string) {
        if (this.userSubscription) {
            if (this.subscribedUid !== uid) {
                // already subscribed, but to a different uid
                console.log('already subscribed, but to a different uid. unsubscribe first.')
                this.userSubscription.unsubscribe();
            }
            else {
                // already subscribed > ok
                return;
            }
        }
        console.log('SUBSCRIBE');
        this.userSubscription = this.cloudData.getUser$(uid).subscribe(user => {
            if (user) {
                this.updateState(UserState.reduceWithData(this.state, user));
            } else {
                this.updateState(UserState.reduceWithMissingData(this.state));
            }
        });
    }

    private updateState(state: UserState.State) {
        this.state = state;

        // Warnings are showed with a delay only. Otherwise temporary mismatches
        // between auth and db state are flashing. An actual mismatch is an 
        // anomaly so we do not care about the flash then. 
        if (this.state.delayHandle) {
            setTimeout(() => {
                this.state = UserState.reduceWithDelayCancel(this.state, state.delayHandle);
            }, 2000);
        }
    }

    private unsubscribeUserData() {
        if (this.userSubscription) {
            console.log('UNSUBSCRIBE');
            this.userSubscription.unsubscribe();
            this.userSubscription = null;
        }
    }

    ngOnDestroy(): void {
        console.log('DESTROY');
        this.unsubscribeUserData();
    }

    async logout() {
        this.unsubscribeUserData();
        this.authService.logout()
            .then(() => this.router.navigateByUrl('/'));
    }

}
