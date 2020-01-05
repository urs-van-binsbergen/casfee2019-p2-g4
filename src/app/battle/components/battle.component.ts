import { Component, OnInit, OnDestroy } from '@angular/core';
import { BattleBoard, BattleField } from '../model/battle-models';
import { PlayerInfo, PlayerStatus, FieldStatus } from '@cloud-api/core-models';
import * as BattleMethods from '../model/battle-methods';
import { Store, Select } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';
import { GameState, GameStateModel } from 'src/app/game/state/game.state';
import { BindGame, UnbindGame, Shoot, Capitulate } from 'src/app/game/state/game.actions';
import { NotificationService } from 'src/app/shared/notification.service';

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
    private _destroy$ = new Subject<void>();

    @Select(GameState.state) _state$: Observable<GameStateModel>;

    constructor(private store: Store, private notification: NotificationService) { }

    ngOnInit(): void {
        this.store.dispatch(new BindGame());
        this._state$.pipe(
            takeUntil(this._destroy$),
            tap((state: GameStateModel) => {
                const player = state.player;
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

                if (this.targetBoard.lastShootStatus) {
                    if (this.targetBoard.lastShootStatus === FieldStatus.Miss) {
                        this.notification.quickToast('Platsch. Gegner ist am Zug');
                    } else if (this.targetBoard.lastShootStatus === FieldStatus.Hit) {
                        this.notification.quickToast('Treffer! Noch ein Zug für Dich');
                    }
                } else if (this.targetBoard.canShoot) {
                    this.notification.quickToast('Du bist am Zug');
                }
            }),
            finalize(() => {
                this.store.dispatch(new UnbindGame());
            })
        ).subscribe();
}

    ngOnDestroy(): void {
        this._destroy$.next();
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

    get isCapitulating(): boolean {
        return this._capitulating;
    }

    onShoot(field: BattleField) {
        if (!this.targetBoard || !this.targetBoard.canShoot || !field.shootable) {
            return;
        }
        this.targetBoard = BattleMethods.updateBoardWithShootingField(this.targetBoard, field);
        this.store.dispatch(new Shoot(field.pos)).toPromise().catch(error => {
            this.targetBoard = BattleMethods.updateBoardWithShootingFieldReset(this.targetBoard, field);
        });
    }

    onUncovered(field: BattleField) {
        this.targetBoard = BattleMethods.updateBoardWithShootingFieldReset(this.targetBoard, field);
    }

    onCapitulationClicked() {
        this._capitulating = true;
        this.store.dispatch(new Capitulate()).toPromise().finally(() => {
            this._capitulating = false;
        });
    }

}
