import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Player } from '@cloud-api/core-models';
import { ObservePlayer, ObserveUser, PlayerUpdated } from './player.actions';
import { tap, takeUntil, first, map } from 'rxjs/operators';

export class PlayerModel {
    player: Player;
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
        ctx.dispatch(new ObserveUser());
    }

    @Action(PlayerUpdated)
    playerUpdated(ctx: StateContext<PlayerModel>, action: PlayerUpdated) {
        const player = action.player || null;
        ctx.setState({ player });
    }

    @Action(ObservePlayer, { cancelUncompleted: true })
    observePlayer(ctx: StateContext<PlayerModel>, action: ObservePlayer) {
        return this.cloudData.getPlayer$(action.uid).pipe(
            map(player => {
                return ctx.dispatch(new PlayerUpdated(player));
            }),
            takeUntil(this.store.select(AuthState.user).pipe(
                first(user => !user)
            ))
        );
    }

    @Action(ObserveUser, { cancelUncompleted: true })
    observeUser(ctx: StateContext<PlayerModel>) {
        return this.store.select(AuthState.user).pipe(
            tap(user => {
                if (user && user.uid) {
                    ctx.dispatch(new ObservePlayer(user.uid));
                } else {
                    ctx.dispatch(new PlayerUpdated(null));
                }
            })
        );
    }

}
