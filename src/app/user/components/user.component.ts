import { Component, OnInit } from '@angular/core';
import { AuthStateService, AuthUser } from 'src/app/auth/auth-state.service';
import { User, PlayerLevel } from '@cloud-api/core-models';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    authUser: AuthUser;
    user: User;
    level: string;
    userSubscription: Subscription;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService
    ) {

    }

    ngOnInit() {
        this.authState.isLoggedIn$.subscribe(isLoggedIn => {
            if(this.userSubscription) {
                this.userSubscription.unsubscribe();
            }
        if (!isLoggedIn) {
                this.authUser = null;
                this.user = null;
                this.level = null;
            } else {
                this.authUser = this.authState.currentUser;
                const uid = this.authState.currentUser.uid;
                this.userSubscription = this.cloudData.getUser$(uid).subscribe(user => {
                    this.user = user;
                    this.level = PlayerLevel[user.level];
                })
            }
        });
    }

}
