import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { BattleBoard, BattleField } from '../battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';
import * as BattleMethods from '../battle-methods';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy {

    opponentInfo: PlayerInfo | null = null;
    targetBoard: BattleBoard | null = null;
    ownBoard: BattleBoard | null = null;
    playerStatus = PlayerStatus.Waiting;
    private _capitulating: boolean;

    constructor(
        private store: Store,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.subscribeData();
    }

    ngOnDestroy(): void {
        this.hideError();
        this.destroy$.next();
    }
    destroy$ = new Subject<void>();

    get shootNow(): boolean {
        return this.targetBoard && this.targetBoard.canShoot && !(this.targetBoard.isShooting) &&
            this.playerStatus !== PlayerStatus.Victory && this.playerStatus !== PlayerStatus.Waterloo;
    }

    get pending(): boolean {
        return !(this.shootNow) && !(this.waitingForOpponentShoot);
    }

    get waitingForOpponentShoot(): boolean {
        return this.targetBoard && !(this.targetBoard.canShoot) &&
            this.playerStatus !== PlayerStatus.Victory && this.playerStatus !== PlayerStatus.Waterloo;
    }

    get isCapitulating(): boolean {
        return this._capitulating;
    }

    subscribeData() {
        const uid = this.store.selectSnapshot(AuthState.authUser).uid;
        this.cloudData.getPlayer$(uid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                player => {
                    this.hideError();
                    if (player && player.battle) {
                        this.opponentInfo = player.battle.opponentInfo;
                        this.targetBoard = BattleMethods.updateTargetBoardWithPlayer(this.targetBoard, player);
                        this.ownBoard = BattleMethods.updateOwnBoardWithPlayer(this.ownBoard, player);
                        this.playerStatus = player.playerStatus;
                    } else {
                        this.opponentInfo = null;
                        this.targetBoard = null;
                        this.ownBoard = null;
                        this.playerStatus = PlayerStatus.Waiting;
                    }
                },
                error => {
                    this.showError('battle.error.state');
                }
            );
    }

    onShoot(field: BattleField) {
        if (!this.targetBoard.canShoot || !field.shootable) {
            return;
        }

        this.targetBoard = BattleMethods.updateBoardWithShootingField(this.targetBoard, field);
        const args: ShootArgs = {
            targetPos: field.pos
        };

        this.hideError();
        this.cloudFunctions.shoot(args).toPromise()
            .then(results => {
            })
            .catch(error => {
                this.targetBoard = BattleMethods.updateBoardWithShootingFieldReset(this.targetBoard, field);
                this.showError('battle.error.shoot');
            })
            ;
    }

    onUncovered(field: BattleField) {
        this.targetBoard = BattleMethods.updateBoardWithShootingFieldReset(this.targetBoard, field);
    }

    onCapitulationClicked() {
        this._capitulating = true;
        this.hideError();
        this.cloudFunctions.capitulate({}).toPromise()
            .then(results => {
                this._capitulating = false;
            })
            .catch(error => {
                this._capitulating = false;
                this.showError('battle.error.capitulation');
            })
            ;
    }

    private hideError() {
        this.snackBar.dismiss();
    }

    private showError(error: string) {
        const message = this.translate.instant(error);
        const close = this.translate.instant('button.close');
        this.snackBar.open(message, close);
    }

}
