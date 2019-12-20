import { Selector, Action, State, StateContext } from '@ngxs/store';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { Player } from '@cloud-api/core-models';
import { GetPlayer } from './player.actions';

export class PlayerModel {
    player: Player;
}

@State<PlayerModel>({
    name: 'player',
    defaults: {
        player: null
    }
})

export class PlayerState {

    constructor(
        private authState: AuthStateService,
        private cloudData: CloudDataService
    ) { }

    @Selector()
    public static player(state: PlayerModel): Player {
        return state.player;
    }

    @Action(GetPlayer)
    getPlayer(ctx: StateContext<PlayerModel>) {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                ctx.setState({player});
            },
            error => {
                ctx.setState({player: null});
            },
            () => {
                ctx.setState({player: null});
            }
        );
    }

}
