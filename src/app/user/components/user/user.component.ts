import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUser } from 'src/app/auth/auth-state.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { NotificationService } from 'src/app/auth/notification.service';
import { UserService } from '../../user.service';
import { User, PlayerLevel } from '@cloud-api/core-models';
import { BattleListModel, getBattleListModel } from '../my-battle-list/my-battle-list.model';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    userData: User;
    authUser: AuthUser;
    level: string;
    myBattleList: BattleListModel;

    constructor(
        private authService: AuthService,
        private cloudData: CloudDataService,
        private router: Router,
        private notification: NotificationService,
        private translate: TranslateService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.userService.authUser$.subscribe(authUser => {
            this.authUser = authUser;

            // Get user data from databse
            this.userService.userData$.subscribe(userData => {
                this.userData = userData;
            });

            // Load stats from database (once)
            if (!authUser) {
                this.myBattleList = null;
                this.level = null;
                return;
            }
            Promise.all([
                this.cloudData.getHistoricBattlesOf(authUser.uid),
                this.cloudData.getHallEntries()
            ])
                .then(results => {
                    const [battles, hallEntries] = results;
                    this.myBattleList = getBattleListModel(authUser.uid, battles, hallEntries);
                    const myHallEntry = hallEntries.find(x => x.playerInfo.uid === authUser.uid);
                    this.level = myHallEntry ? PlayerLevel[myHallEntry.playerInfo.level] : null;
                })
                .catch(error => {
                    this.myBattleList = { battles: [], isLoadFailure: true };
                    const errorDetail = this.notification.localizeFirebaseError(error);
                    const msg = this.translate.instant('user.myBattleList.apiError.loading', { errorDetail });
                    this.notification.quickToast(msg, 2000);
                })
                ;

        });
    }

    async logout() {
        this.authService.logout().then(() => this.router.navigateByUrl('/'));
    }

}
