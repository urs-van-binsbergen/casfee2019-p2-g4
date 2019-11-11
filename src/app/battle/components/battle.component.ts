import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BattleBoard, BattleField, BattleState } from '../battle-models';
import { BattleService } from '../battle.service';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';
import { NotificationService } from 'src/app/auth/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

    private _isVictory = false;
    private _isWaterloo = false;

    constructor(
        private router: Router,
        private battleService: BattleService,
        private notification: NotificationService,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.battleService.battleState$.subscribe((battleState: BattleState) => {
            if (battleState.errorCode) {
                const errorDetail = this.notification.localizeFirebaseErrorCode(battleState.errorCode);
                const msg = this.translate.instant('battle.apiError.loading', { errorDetail });
                this.notification.toastToConfirm(msg);
            }
            this._isVictory = (battleState.status === PlayerStatus.Victory);
            this._isWaterloo = (battleState.status === PlayerStatus.Waterloo);
        });
    }

    get opponentInfo(): PlayerInfo {
        return this.battleService.opponentInfo;
    }

    get targetBoard(): BattleBoard {
        return this.battleService.targetBoard;
    }

    get ownBoard(): BattleBoard {
        return this.battleService.ownBoard;
    }

    get shootNow(): boolean {
        return this.battleService.targetBoard.canShoot && !(this.battleService.targetBoard.isShooting) &&
        !(this._isVictory) && !(this._isWaterloo);
    }

    get pending(): boolean {
        return this.battleService.targetBoard.canShoot && this.battleService.targetBoard.isShooting &&
        !(this._isVictory) && !(this._isWaterloo);
    }

    get waitingForOpponentShoot(): boolean {
        return !(this.battleService.targetBoard.canShoot) && !(this._isVictory) && !(this._isWaterloo);
    }

    get isVictory(): boolean {
        return this._isVictory;
    }

    get isWaterloo(): boolean {
        return this._isWaterloo;
    }

    onShoot(field: BattleField) {
        this.battleService.onShoot(field);
    }

    onUncovered(field: BattleField) {
        this.battleService.onUncovered(field);
    }

    onCapitulationClicked() {
        this.router.navigateByUrl('/hall');
    }

}
