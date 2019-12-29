import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, AuthUser } from 'src/app/auth/auth.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { UserService } from '../../user.service';
import { PlayerLevel } from '@cloud-api/core-models';
import { BattleListModel, getBattleListModel } from '../my-battle-list/my-battle-list.model';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
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
    destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private authService: AuthService,
        private cloudData: CloudDataService,
        private router: Router,
        private notification: NotificationService,
        private translate: TranslateService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.store.select(AuthState.authUser)
            .pipe(takeUntil(this.destroy$))
            .subscribe(authUser => {
                this.authUser = authUser;

                // get level from db data
                this.userService.userData$.subscribe(userData => {
                    this.level = userData ? PlayerLevel[userData.level] : null;
                });
                // TODO: unsubscribe. Store. MergeMap...

                // Load stats from db data (once)
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
                        this.myBattleList = getBattleListModel(authUser.uid, [...battles].reverse(), hallEntries);
                    })
                    .catch(error => {
                        this.myBattleList = { battles: [], isLoadFailure: true, isLoadingDone: true };
                        const errorMsg = this.translate.instant('common.error.apiReadError'); // TODO
                        this.notification.quickToast(errorMsg, 2000);
                    })
                    ;

            });

        this.store.select(AuthState.logout)
            .pipe(
                takeUntil(this.destroy$),
                tap(model => {
                    if (model && model.success) {
                        this.router.navigateByUrl('/');
                    }
                })
            )
            .subscribe();
    }

    async logout() {
        this.store.dispatch(new Logout());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
