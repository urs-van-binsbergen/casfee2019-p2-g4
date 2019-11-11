import { Injectable } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, BattleField, BattleState } from './battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus, PlayerLevel } from '@cloud-api/core-models';
import * as battleMethods from './battle-methods';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export abstract class BattleService {
    readonly opponentInfo: PlayerInfo | null;
    readonly targetBoard: BattleBoard | null;
    readonly ownBoard: BattleBoard | null;
    readonly battleState$: Observable<BattleState>;
    abstract onShoot(field: BattleField): void;
    abstract onUncovered(field: BattleField): void;
}

@Injectable()
export class BattleServiceCloud implements BattleService {

    private _opponentInfo: PlayerInfo | null = null;
    private _targetBoard: BattleBoard | null = null;
    private _ownBoard: BattleBoard | null = null;
    private _battleState$: BehaviorSubject<BattleState>;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService
    ) {
        this._battleState$ = new BehaviorSubject<BattleState>(new BattleState(PlayerStatus.Waiting, null));
        this.subscribeData();
    }

    get opponentInfo(): PlayerInfo {
        return this._opponentInfo;
    }

    get targetBoard(): BattleBoard {
        return this._targetBoard;
    }

    get ownBoard(): BattleBoard {
        return this._ownBoard;
    }

    get battleState$(): Observable<BattleState> {
        return this._battleState$.asObservable();
    }

    public onShoot(field: BattleField): void {
        if (!this.targetBoard.canShoot || !field.shootable) {
            return;
        }
        this._targetBoard = battleMethods.reduceBoardWithShootingField(this._targetBoard, field);
        const args: ShootArgs = {
            targetPos: field.pos,
            miniGameGuess: null
        };
        this.cloudFunctions.shoot(args).toPromise()
            .then(results => {
            })
            .catch(error => {
                this._targetBoard = battleMethods.reduceBoardWithFailedField(this._targetBoard, field);
                this.handleError(error);
            });
    }

    public onUncovered(field: BattleField): void {
        this._targetBoard = battleMethods.reduceBoardWithUncoveredField(this._targetBoard, field);
    }

    private subscribeData() {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                if (player && player.battle) {
                    this._opponentInfo = player.battle.opponentInfo;
                    const targetBoard = battleMethods.createTargetBoard(player);
                    this._targetBoard = battleMethods.reduceBoardWithBoard(this._targetBoard, targetBoard);
                    const ownBoard = battleMethods.createOwnBoard(player);
                    this._ownBoard = battleMethods.reduceBoardWithBoard(this._ownBoard, ownBoard);
                } else {
                    this._opponentInfo = null;
                    this._targetBoard = null;
                    this._ownBoard = null;
                }
                if (player) {
                    const value = this._battleState$.value;
                    const battleState = battleMethods.reduceStateWithStatus(value, player.playerStatus);
                    this._battleState$.next(battleState);
                }
            },
            error => {
                this.handleError(error);
            }
        );
    }

    private handleError(error: firebase.FirebaseError): void {
        console.log('battle.service ' + battleMethods.errorLogMessage(error));
        const errorCode = battleMethods.errorCode(error);
        const value = this._battleState$.value;
        const battleState = battleMethods.reduceStateWithErrorCode(value, errorCode);
        this._battleState$.next(battleState);
    }
}

@Injectable()
export class BattleServiceLoop implements BattleService {

    private _opponentInfo: PlayerInfo | null = null;
    private _board: BattleBoard | null = null;
    private _timeOut = null;
    private _battleState$: BehaviorSubject<BattleState>;

    constructor() {
        this._battleState$ = new BehaviorSubject<BattleState>(new BattleState(PlayerStatus.Waiting, null));
        this.subscribeData();
    }

    get opponentInfo(): PlayerInfo {
        return this._opponentInfo;
    }

    get targetBoard(): BattleBoard {
        return this._board;
    }

    get ownBoard(): BattleBoard {
        return this._board;
    }

    get battleState$(): Observable<BattleState> {
        return this._battleState$.asObservable();
    }

    public onShoot(field: BattleField): void {
        this._board = battleMethods.reduceBoardWithShootingField(this._board, field);
        const board = battleMethods.copyBoard(this._board);
        clearTimeout(this._timeOut);
        this._timeOut = setTimeout(() => {
            this.shoot(board, field);
        }, 1000);
    }

    public onUncovered(field: BattleField): void {
        this._board = battleMethods.reduceBoardWithUncoveredField(this._board, field);
    }

    private shoot(board: BattleBoard, field: BattleField): void {
        if (field.pos.x === 7 && field.pos.y === 0) {
            this._board = battleMethods.reduceBoardWithUncoveringField(board, field, true);
            this._board.canShoot = false;
            const value = this._battleState$.value;
            const battleState = battleMethods.reduceStateWithStatus(value, PlayerStatus.Victory);
            this._battleState$.next(battleState);
        } else if (field.pos.x === 7 && field.pos.y === 1) {
            this._board = battleMethods.reduceBoardWithUncoveringField(board, field, true);
            this._board.canShoot = false;
            const value = this._battleState$.value;
            const battleState = battleMethods.reduceStateWithStatus(value, PlayerStatus.Waterloo);
            this._battleState$.next(battleState);
        } else if (field.pos.x === 7 && field.pos.y === 2) {
            this._board = battleMethods.reduceBoardWithFailedField(this._board, field);
            const value = this._battleState$.value;
            const battleState = battleMethods.reduceStateWithErrorCode(value, 'undefined');
            this._battleState$.next(battleState);
        } else {
            this._board = battleMethods.reduceBoardWithUncoveringField(board, field, true);
            const value = this._battleState$.value;
            const battleState = battleMethods.reduceStateWithStatus(value, PlayerStatus.Waiting);
            this._battleState$.next(battleState);
        }
    }

    private subscribeData() {
        this._opponentInfo = {
            uid: 'uid',
            displayName: 'displayName',
            avatarFileName: '',
            level: PlayerLevel.Admiral
        };
        this._board = battleMethods.laodBoard();
    }

}

