import { Action, State, Selector, StateContext, Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { catchError, finalize, takeUntil, tap, switchMap } from 'rxjs/operators';
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
        unauthenticated: true,
        player: null
    }
})

export class GameState {

    private _unbind$: Subject<void>;
    private _observers: number;

    constructor(
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService,
        private store: Store,
        private notification: NotificationService
    ) {
        this._unbind$ = null;
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
                return of();
            })
        );
    }

    @Action(Capitulate)
    capitulate(ctx: StateContext<GameStateModel>) {
        return this.cloudFunctions.capitulate({}).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('game.error.capitulation');
                return of();
            })
        );
    }

    @Action(Delete)
    delete(ctx: StateContext<GameStateModel>) {
        return this.cloudFunctions.deleteGameData({}).pipe(
            catchError((error) => {
                this.notification.quickErrorToast('game.error.delete');
                return of();
            })
        );
    }

    @Action(UpdateGame)
    updateGame(ctx: StateContext<GameStateModel>, action: UpdateGame) {
        ctx.patchState({
            loading: false,
            unauthenticated: action.unauthenticated,
            player: action.player || null
        });
    }

    @Action(BindGame)
    bindGame(ctx: StateContext<GameStateModel>) {
        this._observers++;
        if (!(this._unbind$)) {
            ctx.patchState({ loading: true });
            this._unbind$ = new Subject<void>();
            this.store.select(AuthState.authUser).pipe(
                switchMap((authUser: AuthUser) => {
                    if (authUser && authUser.uid) {
                        return this.cloudData.getPlayer$(authUser.uid).pipe(
                            tap((player: Player) => {
                                ctx.dispatch(new UpdateGame(player, false));
                            }),
                            catchError((error) => {
                                ctx.dispatch(new UpdateGame(null, true));
                                this.notification.quickErrorToast('game.error.player');
                                return of();
                            })
                        );
                    } else {
                        ctx.dispatch(new UpdateGame(null, true));
                        return of();
                    }
                }),
                catchError((error) => {
                    this.notification.quickErrorToast('game.error.player');
                    return of();
                }),
                takeUntil(this._unbind$),
                finalize(() => {
                    ctx.dispatch(new UpdateGame(null, true));
                    this._unbind$ = null;
                })
            ).subscribe();
        }
    }

    @Action(UnbindGame)
    unbindGame(ctx: StateContext<GameStateModel>) {
        this._observers--;
        if (this._observers <= 0) {
            this._observers = 0;
            if (this._unbind$) {
                this._unbind$.next();
            }
        }
    }

}
