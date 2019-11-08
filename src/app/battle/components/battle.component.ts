import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, BattleField } from '../battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';
import * as battleMethods from '../battle-methods';
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
    shootNow = false;
    waitingForOpponentShoot = false;
    isVictory = false;
    isWaterloo = false;

    constructor(
        private router: Router,
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private notification: NotificationService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.subscribeData();
    }

    subscribeData() {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                if (player && player.battle) {
                    this.opponentInfo = player.battle.opponentInfo;
                    this.targetBoard = battleMethods.createTargetBoard(player);
                    this.ownBoard = battleMethods.createOwnBoard(player);
                    this.isVictory = player.playerStatus === PlayerStatus.Victory;
                    this.isWaterloo = player.playerStatus === PlayerStatus.Waterloo;
                    this.shootNow = this.targetBoard.canShoot;
                    this.waitingForOpponentShoot = !this.targetBoard.canShoot &&
                                                    !this.isVictory &&
                                                    !this.isWaterloo;
                } else {
                    this.opponentInfo = null;
                    this.targetBoard = null;
                    this.ownBoard = null;
                    this.isVictory = false;
                    this.isWaterloo = false;
                    this.shootNow = false;
                    this.waitingForOpponentShoot = false;
                }
            },
            error => {
                console.log('error');
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

        field.shooting = true;
        const args: ShootArgs = {
            targetPos: field.pos,
            miniGameGuess: null
        };

        this.cloudFunctions.shoot(args).toPromise()
            .then(results => {
                field.shooting = false;
            })
            .catch(error => {
                const errorDetail = this.notification.localizeFirebaseError(error);
                const msg = this.translate.instant('battle.apiError.shooting', { errorDetail });
                this.notification.toastToConfirm(msg);
            })
            ;
    }

    onCapitulationClicked() {
        this.router.navigateByUrl('/hall');
    }

}
