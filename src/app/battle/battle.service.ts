import { Injectable } from '@angular/core';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, BattleField, Row } from './battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus, PlayerLevel, Pos, FieldStatus } from '@cloud-api/core-models';
import * as battleMethods from './battle-methods';
import { Observable, Subject } from 'rxjs';

enum State {
    Battle,
    Victory,
    Defeat
}

export class BattleState {
    public static readonly State = State;
    constructor(public state: State, public errorCode: string) {
    }
}

function _errorCode(error: firebase.FirebaseError): string {
    if (!error || error.code === undefined) {
        return 'undefined';
    }
    return error.code;
}

function _errorLogMessage(error: firebase.FirebaseError): string {
    let m = '';
    if (error) {
        if (error.code) {
            m = m + ' ' + error.code;
        }
        if (error.message) {
            m = m + ' ' + error.message;
        }
    }
    return m;
}

function _state(playerStatus: PlayerStatus): State {
    if (playerStatus === PlayerStatus.Victory) {
        return BattleState.State.Victory;
    }
    if (playerStatus === PlayerStatus.Waterloo) {
        return BattleState.State.Defeat;
    }
    return BattleState.State.Battle;
}

@Injectable()
export abstract class BattleService {
    readonly opponentInfo: PlayerInfo | null;
    readonly targetBoard: BattleBoard | null;
    readonly ownBoard: BattleBoard | null;
    readonly shootNow: boolean;
    readonly waitingForOpponentShoot: boolean;
    readonly isVictory: boolean;
    readonly isWaterloo: boolean;
    readonly battleState$: Observable<BattleState>;
    abstract onShoot(field: BattleField): void;
}

@Injectable()
export class BattleServiceCloud implements BattleService {

    private _opponentInfo: PlayerInfo | null = null;
    private _targetBoard: BattleBoard | null = null;
    private _ownBoard: BattleBoard | null = null;
    private _shootNow = false;
    private _waitingForOpponentShoot = false;
    private _isVictory = false;
    private _isWaterloo = false;
    private _battleState$: Subject<BattleState>;

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService
    ) {
        this._battleState$ = new Subject<BattleState>();
        this._battleState$.next(new BattleState(BattleState.State.Battle, null));
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

    get shootNow(): boolean {
        return this._shootNow;
    }

    get waitingForOpponentShoot(): boolean {
        return this._waitingForOpponentShoot;
    }

    get isVictory(): boolean {
        return this._isVictory;
    }

    get isWaterloo(): boolean {
        return this._isWaterloo;
    }

    get battleState$(): Observable<BattleState> {
        return this._battleState$.asObservable();
    }

    public onShoot(field: BattleField): void {
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
                console.log('battle.service' + _errorLogMessage(error));
                this._battleState$.next(new BattleState(BattleState.State.Battle, _errorCode(error)));
            })
            ;
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
                    this._isVictory = player.playerStatus === PlayerStatus.Victory;
                    this._isWaterloo = player.playerStatus === PlayerStatus.Waterloo;
                    this._shootNow = this.targetBoard.canShoot;
                    this._waitingForOpponentShoot = !this.targetBoard.canShoot &&
                        !this.isVictory &&
                        !this.isWaterloo;
                    this._battleState$.next(new BattleState(_state(player.playerStatus), null));
                } else {
                    this._opponentInfo = null;
                    this._targetBoard = null;
                    this._ownBoard = null;
                    this._isVictory = false;
                    this._isWaterloo = false;
                    this._shootNow = false;
                    this._waitingForOpponentShoot = false;
                }
            },
            error => {
                console.log('battle.service ' + _errorLogMessage(error));
                this._battleState$.next(new BattleState(BattleState.State.Battle, _errorCode(error)));
            }
        );
    }

}

@Injectable()
export class BattleServiceLoop implements BattleService {

    private _opponentInfo: PlayerInfo | null = null;
    private _board: BattleBoard | null = null;
    private _state = BattleState.State.Battle;
    private _timeOut = null;
    private _battleState$: Subject<BattleState>;

    constructor() {
        this._battleState$ = new Subject<BattleState>();
        this._battleState$.next(new BattleState(BattleState.State.Battle, null));
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

    get shootNow(): boolean {
        return true;
    }

    get waitingForOpponentShoot(): boolean {
        return false;
    }

    get isVictory(): boolean {
        return this._state === BattleState.State.Victory;
    }

    get isWaterloo(): boolean {
        return this._state === BattleState.State.Defeat;
    }

    get battleState$(): Observable<BattleState> {
        return this._battleState$.asObservable();
    }

    public onShoot(field: BattleField): void {
        field.status = FieldStatus.Miss;
        clearTimeout(this._timeOut);
        this._timeOut = setTimeout(() => {
            this.shoot(field);
        }, 1000);
    }

    private shoot(field: BattleField): void {
        if (field.pos.x === 7 && field.pos.y === 0) {
            this._state = BattleState.State.Victory;
            this._battleState$.next(new BattleState(this._state, null));
        } else if (field.pos.x === 7 && field.pos.y === 1) {
            this._state = BattleState.State.Defeat;
            this._battleState$.next(new BattleState(this._state, null));
        } else if (field.pos.x === 7 && field.pos.y === 2) {
            this._battleState$.next(new BattleState(this._state, 'undefined'));
        } else if (field.pos.x < 4) {
            field.status = FieldStatus.Miss;
        } else {
            field.status = FieldStatus.Hit;
        }
    }

    private subscribeData() {
        this._opponentInfo = {
            uid: 'uid',
            displayName: 'displayName',
            avatarFileName: '',
            level: PlayerLevel.Admiral
        };
        const rows: Row[] = [];
        for (let y = 0 ; y < 8; y++) {
            const battleFields: BattleField[] = [];
            for (let x = 0; x < 8; x++) {
                const pos: Pos = {x, y};
                const battleField = new BattleField(pos, FieldStatus.Unknown);
                battleFields.push(battleField);
            }
            const row = new Row(battleFields);
            rows.push(row);
        }
        this._board = new BattleBoard(rows, [], true);
    }

}

