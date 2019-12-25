import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateService, AuthUser } from 'src/app/auth/auth-state.service';
import { ObserveUser, UpdateUser } from './auth.actions';
import { map } from 'rxjs/operators';

export class AuthModel {
    user: AuthUser;
}

@State<AuthModel>({
    name: 'auth',
    defaults: {
        user: null,
    }
})

export class AuthState implements NgxsOnInit {

    constructor(
        private authState: AuthStateService
    ) {
    }

    @Selector()
    public static user(state: AuthModel): AuthUser {
        return state.user;
    }

    @Action(UpdateUser)
    updateUser(ctx: StateContext<AuthModel>, action: UpdateUser) {
        const user = action.user;
        ctx.setState({ user });
    }

    @Action(ObserveUser, { cancelUncompleted: true })
    observeUser(ctx: StateContext<AuthModel>) {
        return this.authState.currentUser$.pipe(
            map(user => {
                return ctx.dispatch(new UpdateUser(user));
            })
        );
    }

    ngxsOnInit(ctx: StateContext<AuthModel>) {
        ctx.dispatch(new ObserveUser());
    }

}
