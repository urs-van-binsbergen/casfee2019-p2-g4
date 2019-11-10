import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BattleBoard, BattleField } from '../battle-models';
import { BattleService, BattleState } from '../battle.service';
import { PlayerInfo } from '@cloud-api/core-models';
import { NotificationService } from 'src/app/auth/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

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
            } else if (battleState.state === BattleState.State.Defeat) {
                // route
            } else if (battleState.state === BattleState.State.Victory) {
                // route
            }
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
        return this.battleService.shootNow;
    }

    get waitingForOpponentShoot(): boolean {
        return this.battleService.waitingForOpponentShoot;
    }

    get isVictory(): boolean {
        return this.battleService.isVictory;
    }

    get isWaterloo(): boolean {
        return this.battleService.isWaterloo;
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
