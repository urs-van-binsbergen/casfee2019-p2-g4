import { Action, State, Selector, StateContext, Store } from '@ngxs/store';
import { Subject, of, throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { BindGame, Capitulate, Delete, Shoot, UnbindGame, UpdateGame } from './game.actions';
import { Player } from '@cloud-api/core-models';
import { NotificationService } from 'src/app/shared/notification.service';
import { ShootArgs } from '@cloud-api/arguments';
import { AuthState } from 'src/app/auth/state/auth.state';
import { AuthUser } from 'src/app/auth/auth.service';

export interface GameStateModel {
    loading: boolean;
    unauthenticated: boolean;
    player: Player;
}

@State<GameStateModel>({
    name: 'game',
    defaults: {
        loading: false,
        unauthenticated: false,
        player: null
    }
})

export class GameState {

    private _unbindAuth$: Subject<void>;
    private _unbindPlayer$: Subject<void>;
    private _observers: number;

    constructor(
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private store: Store,
        private notification: NotificationService
    ) {
        this._unbindAuth$ = null;
        this._unbindPlayer$ = null;
        this._observers = 0;
    }

    @Selector()
    public static loading(state: GameStateModel): boolean {
        return state.loading;
    }

    @Selector()
    public static player(state: GameStateModel): Player {
        return state.player;
    }

    @Selector()
    public static state(state: GameStateModel): GameStateModel {
        return state;
    }

    @Action(Shoot)
    shoot(ctx: StateContext<GameStateModel>, action: Shoot) {
        const args: ShootArgs = {
            targetPos: action.pos
        };
        return this.cloudFunctions.shoot(args).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('game.error.shoot');
                return throwError(error);
            })
        );
    }

    @Action(Capitulate)
    capitulate(ctx: StateContext<GameStateModel>) {
        return this.cloudFunctions.capitulate({}).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('game.error.capitulation');
                return throwError(error);
            })
        );
    }

    @Action(Delete)
    delete(ctx: StateContext<GameStateModel>) {
        const args = {};
        return this.cloudFunctions.deleteGameData(args).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('game.error.delete');
                return of();
            })
        );
    }

    @Action(UpdateGame)
    updateGame(ctx: StateContext<GameStateModel>, action: UpdateGame) {
        ctx.patchState({ loading: false, player: action.player || null });
    }

    @Action(BindGame)
    bindGame(ctx: StateContext<GameStateModel>) {
        this._observers++;
        if (!(this._unbindAuth$)) {
            ctx.patchState({ loading: true, unauthenticated: true });
            this._unbindAuth$ = new Subject<void>();
            this.store.select(AuthState.authUser).pipe(
                takeUntil(this._unbindAuth$),
                tap((authUser: AuthUser) => {
                    if (authUser && authUser.uid) {
                        ctx.patchState({ unauthenticated: false });
                        if (!(this._unbindPlayer$)) {
                            this._unbindPlayer$ = new Subject<void>();
                            this.cloudData.getPlayer$(authUser.uid).pipe(
                                takeUntil(this._unbindPlayer$),
                                tap((player: Player) => {
                                    ctx.dispatch(new UpdateGame(player));
                                }),
                                catchError((error) => {
                                    this.notification.quickErrorToast('game.error.player');
                                    return of();
                                }),
                                finalize(() => {
                                    this._unbindPlayer$ = null;
                                    ctx.dispatch(new UpdateGame(null));
                                })
                            ).subscribe();
                        }
                    } else {
                        ctx.patchState({ unauthenticated: true });
                        if (this._unbindPlayer$) {
                            this._unbindPlayer$.next();
                        }
                    }
                }),
                finalize(() => {
                    ctx.patchState({ unauthenticated: true });
                    if (this._unbindPlayer$) {
                        this._unbindPlayer$.next();
                    }
                    this._unbindAuth$ = null;
                })
            ).subscribe();
        }
    }

    @Action(UnbindGame)
    unbindGame(ctx: StateContext<GameStateModel>) {
        this._observers--;
        if (this._observers <= 0) {
            this._observers = 0;
            if (this._unbindAuth$) {
                this._unbindAuth$.next();
            }
        }
    }

}
