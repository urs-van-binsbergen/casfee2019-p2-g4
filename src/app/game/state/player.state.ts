import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Player } from '@cloud-api/core-models';
import { ObservePlayer, ObserveUser, UpdatePlayer } from './player.actions';
import { tap } from 'rxjs/operators';

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

    @Action(UpdatePlayer)
    updatePlayer(ctx: StateContext<PlayerModel>, action: UpdatePlayer) {
        const player = action.player;
        ctx.setState({ player });
    }

    @Action(ObservePlayer, { cancelUncompleted: true })
    observePlayer(ctx: StateContext<PlayerModel>, action: ObservePlayer) {
        return this.cloudData.getPlayer$(action.uid).pipe(
            tap(player => {
                ctx.dispatch(new UpdatePlayer(player));
            })
        );
    }

    @Action(ObserveUser, { cancelUncompleted: true })
    observeUser(ctx: StateContext<PlayerModel>) {
        return this.store.select(AuthState.user).pipe(
            tap(user => {
                if (user && user.uid) {
                    ctx.dispatch(new ObservePlayer(user.uid));
                } else {
                    ctx.dispatch(new UpdatePlayer(null));
                }
            })
        );
    }

    ngxsOnInit(ctx: StateContext<PlayerModel>) {
        ctx.dispatch(new ObserveUser());
    }

}
