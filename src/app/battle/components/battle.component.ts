import { Component, OnInit, OnDestroy } from '@angular/core';
import { BattleBoard, BattleField } from '../model/battle-models';
import { PlayerInfo, PlayerStatus, FieldStatus } from '@cloud-api/core-models';
import * as BattleMethods from '../model/battle-methods';
import { Store, Select } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';
import { GameState, GameStateModel } from 'src/app/game/state/game.state';
import { BindGame, UnbindGame, Shoot, Capitulate } from 'src/app/game/state/game.actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit, OnDestroy {

    loading = false;
    opponentInfo: PlayerInfo | null = null;
    targetBoard: BattleBoard | null = null;
    ownBoard: BattleBoard | null = null;
    playerStatus = PlayerStatus.Waiting;
    private _capitulating: boolean;
    private _destroy$ = new Subject<void>();

    targetBoardInfo: string;
    ownBoardInfo: string;

    @Select(GameState.state) _state$: Observable<GameStateModel>;

    constructor(private store: Store, private translate: TranslateService) { }

    ngOnInit(): void {
        this.loading = true;
        this.store.dispatch(new BindGame());
        this._state$.pipe(
            takeUntil(this._destroy$),
            tap((state: GameStateModel) => {
                this.loading = false;
                const player = state.player;
                if (player && player.battle) {
                    this.opponentInfo = player.battle.opponentInfo;
                    this.targetBoard = BattleMethods.updateTargetBoardWithPlayer(this.targetBoard, player);
                    this.ownBoard = BattleMethods.updateOwnBoardWithPlayer(this.ownBoard, player);
                    this.playerStatus = player.playerStatus;

                    if (player.playerStatus === PlayerStatus.InBattle) {
                        this.displayEventMessages();
                    }

                } else {
                    this.opponentInfo = null;
                    this.targetBoard = null;
                    this.ownBoard = null;
                    this.playerStatus = PlayerStatus.Waiting;
                }

            }),
            finalize(() => {
                this.loading = false;
                this.store.dispatch(new UnbindGame());
            })
        ).subscribe();
    }

    private displayEventMessages() {
        if (this.targetBoard.lastShotResult) {
            if (this.targetBoard.lastShotResult === FieldStatus.Miss) {
                this.ownBoardInfo = this.translate.instant('battle.message.miss',
                    { opponentName: this.opponentInfo.displayName });
                this.targetBoardInfo = '';
            } else if (this.targetBoard.lastShotResult === FieldStatus.Hit) {
                if (this.targetBoard.shipSunk) {
                    this.targetBoardInfo = this.translate.instant('battle.message.sunk');
                } else {
                    this.targetBoardInfo = this.translate.instant('battle.message.hit');
                }
            }
        } else if (this.ownBoard.lastShotResult) {
            if (this.ownBoard.lastShotResult === FieldStatus.Miss) {
                this.targetBoardInfo = this.translate.instant('battle.message.oppMiss');
                this.ownBoardInfo = '';
            } else if (this.ownBoard.lastShotResult === FieldStatus.Hit) {
                if (this.ownBoard.shipSunk) {
                    this.ownBoardInfo = this.translate.instant('battle.message.myShipSunk',
                    { opponentName: this.opponentInfo.displayName });
                } else {
                    this.ownBoardInfo = this.translate.instant('battle.message.oppHit',
                    { opponentName: this.opponentInfo.displayName });
                }
            }
        } else if (this.targetBoard.canShoot) {
            this.targetBoardInfo = this.translate.instant('battle.message.yourTurn');
        } else if (this.ownBoard.canShoot) {
            this.ownBoardInfo = this.translate.instant('battle.message.oppTurn',
                { opponentName: this.opponentInfo.displayName });
        }
    }

    ngOnDestroy(): void {
        this._destroy$.next();
    }

    get myTurn(): boolean {
        return this.targetBoard && this.targetBoard.canShoot;
    }

    get shooting(): boolean {
        return this.targetBoard && this.targetBoard.isShooting;
    }

    get opponentTurn(): boolean {
        return this.targetBoard && !this.targetBoard.canShoot;
    }

    get isCapitulating(): boolean {
        return this._capitulating;
    }

    onShoot(field: BattleField) {
        if (!this.targetBoard || !this.targetBoard.canShoot || !field.shootable) {
            return;
        }
        this.targetBoard = BattleMethods.updateBoardWithFieldIsShooting(this.targetBoard, field, true);
        this.store.dispatch(new Shoot(field.pos)).toPromise().catch(error => {
            this.targetBoard = BattleMethods.updateBoardWithFieldIsShooting(this.targetBoard, field, false);
        });
    }

    onUncovered(field: BattleField) {
        this.targetBoard = BattleMethods.updateBoardWithFieldIsShooting(this.targetBoard, field, false);
    }

    onOwnFieldUncovered(field: BattleField) {
        this.ownBoard = BattleMethods.updateBoardWithFieldIsShooting(this.ownBoard, field, false);
    }

    onCapitulationClicked() {
        this._capitulating = true;
        this.store.dispatch(new Capitulate()).toPromise().finally(() => {
            this._capitulating = false;
        });
    }

}
