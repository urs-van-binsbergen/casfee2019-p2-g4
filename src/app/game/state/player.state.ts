import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Player } from '@cloud-api/core-models';
import { ObservePlayer, ObserveAuthUser, PlayerUpdated, Unauthenticated as Unauthenticated } from './player.actions';
import { takeUntil, first, map } from 'rxjs/operators';

export interface PlayerModel {
    player: Player | null;
    loading?: boolean;
    unauthenticated?: boolean;
}

@State<PlayerModel>({
    name: 'player',
    defaults: {
        player: null,
    }
})

export class PlayerState implements NgxsOnInit {

    constructor(
        private store: Store,
        private cloudData: CloudDataService
    ) {
    }

    @Selector()
    public static player(state: PlayerModel): Player {
        return state.player;
    }

    ngxsOnInit(ctx: StateContext<PlayerModel>) {
        ctx.dispatch(new ObserveAuthUser());
    }

    @Action(PlayerUpdated)
    playerUpdated(ctx: StateContext<PlayerModel>, action: PlayerUpdated) {
        const player = action.player || null;
        ctx.setState({ player });
    }

    @Action(ObservePlayer, { cancelUncompleted: true })
    observePlayer(ctx: StateContext<PlayerModel>, action: ObservePlayer) {
        ctx.patchState({ loading: true });

        return this.cloudData.getPlayer$(action.uid).pipe(
            map(player => {
                return ctx.dispatch(new PlayerUpdated(player));
            }),
            takeUntil(this.store.select(AuthState.authUser).pipe(
                first(user => !user)
            ))
        );
    }

    @Action(ObserveAuthUser, { cancelUncompleted: true })
    observeAuthUser(ctx: StateContext<PlayerModel>) {
        return this.store.select(AuthState.authUser).pipe(
            map(user => {
                if (user && user.uid) {
                    return ctx.dispatch(new ObservePlayer(user.uid));
                } else {
                    return ctx.dispatch(new Unauthenticated());
                }
            })
        );
    }

    @Action(Unauthenticated)
    unauthenticated(ctx: StateContext<PlayerModel>) {
        ctx.setState({
            player: null,
            unauthenticated: true
        });
    }

}
