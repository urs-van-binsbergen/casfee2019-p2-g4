import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUser } from 'src/app/auth/auth.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { PlayerLevel, User } from '@cloud-api/core-models';
import { BattleListModel, getBattleListModel } from '../my-battle-list/my-battle-list.model';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Subject } from 'rxjs';
import { takeUntil, tap, skip } from 'rxjs/operators';
import { Logout } from 'src/app/auth/state/auth.actions';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

    authUser: AuthUser;
    level: string;
    myBattleList: BattleListModel;
    loggingOut = false;
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private cloudData: CloudDataService,
        private router: Router,
        private notification: NotificationService,
        private translate: TranslateService,
    ) { }

    ngOnInit(): void {
        this.selectAuthUser();
        this.selectUser();
        this.selectLogoutResult();
    }

    private selectAuthUser() {
        this.store.select(AuthState.authUser)
            .pipe(
                takeUntil(this.destroy$),
                tap<AuthUser>(authUser => {
                    this.authUser = authUser;
                })
            )
            .subscribe();
    }

    private selectUser() {
        let oldUid: string;
        this.store.select(AuthState.user)
            .pipe(
                takeUntil(this.destroy$),
                tap<User>(userData => {
                    if (!userData) {
                        this.level = null;
                        this.myBattleList = null;
                        oldUid = undefined;
                    } else {
                        this.level = PlayerLevel[userData.level];
                        if (userData.uid !== oldUid) {
                            this.loadMyBattleList(userData.uid);
                        }
                        oldUid = userData.uid;
                    }
                }),
            )
            .subscribe();
    }


    private loadMyBattleList(uid: string) {
        this.myBattleList = { battles: [] };

        Promise.all([
            this.cloudData.getHistoricBattlesOf(uid),
            this.cloudData.getHallEntries()
        ])
            .then(results => {
                const [battles, hallEntries] = results;
                this.myBattleList = getBattleListModel(uid, [...battles].reverse(), hallEntries);
            })
            .catch(error => {
                this.myBattleList = { battles: [], isLoadFailure: true, isLoadingDone: true };
                const errorMsg = this.translate.instant('common.error.apiReadError', { errorDetail: error });
                this.notification.quickToast(errorMsg, 2000);
            })
            ;
    }

    private selectLogoutResult() {
        this.store.select(AuthState.logoutResult)
            .pipe(
                takeUntil(this.destroy$),
                skip(1),
                tap(model => {
                    this.loggingOut = false;
                    if (model && model.success) {
                        this.router.navigateByUrl('/');
                    }
                })
            )
            .subscribe();
    }


    async logout() {
        this.loggingOut = true;
        this.store.dispatch(new Logout());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
