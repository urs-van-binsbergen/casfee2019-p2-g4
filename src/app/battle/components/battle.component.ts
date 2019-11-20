import { Component, OnInit } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, BattleField } from '../battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';
import * as BattleMethods from '../battle-methods';
import { NotificationService } from 'src/app/auth/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

    opponentInfo: PlayerInfo | null = null;
    targetBoard: BattleBoard | null = null;
    ownBoard: BattleBoard | null = null;
    playerStatus = PlayerStatus.Waiting;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private notification: NotificationService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.subscribeData();
    }

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

    get isVictory(): boolean {
        return this.playerStatus === PlayerStatus.Victory;
    }

    get isWaterloo(): boolean {
        return this.playerStatus === PlayerStatus.Waterloo;
    }

    subscribeData() {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                if (player && player.battle) {
                    this.opponentInfo = player.battle.opponentInfo;
                    const targetBoard = BattleMethods.createTargetBoard(player);
                    this.targetBoard = BattleMethods.reduceBoardWithBoard(this.targetBoard, targetBoard);
                    const ownBoard = BattleMethods.createOwnBoard(player);
                    this.ownBoard = BattleMethods.reduceBoardWithBoard(this.ownBoard, ownBoard);
                    this.playerStatus = player.playerStatus;
                } else {
                    this.opponentInfo = null;
                    this.targetBoard = null;
                    this.ownBoard = null;
                    this.playerStatus = PlayerStatus.Waiting;
                }
            },
            error => {
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('battle.apiError.loading', { errorDetail });
                this.notification.toastToConfirm(msg);
            }
        );
    }

    onShoot(field: BattleField) {
        if (!this.targetBoard.canShoot || !field.shootable) {
            return;
        }

        this.targetBoard = BattleMethods.reduceBoardWithShootingField(this.targetBoard, field);
        const args: ShootArgs = {
            targetPos: field.pos
        };

        this.cloudFunctions.shoot(args).toPromise()
            .then(results => {
            })
            .catch(error => {
                this.targetBoard = BattleMethods.reduceBoardWithShootingFieldReset(this.targetBoard, field);
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('battle.apiError.sending', { errorDetail });
                this.notification.toastToConfirm(msg);
            })
            ;
    }

    onUncovered(field: BattleField) {
        this.targetBoard = BattleMethods.reduceBoardWithShootingFieldReset(this.targetBoard, field);
    }

    onCapitulationClicked() {
        this.cloudFunctions.capitulate({}).toPromise()
            .then(results => {
            })
            .catch(error => {
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('battle.apiError.sending', { errorDetail });
                this.notification.toastToConfirm(msg);
            })
            ;
    }

}
