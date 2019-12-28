import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveAuthUser as ObserveAuthUser, AuthUserChanged } from './auth.actions';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from '../auth.service';

export class AuthModel {
    authUser: AuthUser;
}

@State<AuthModel>({
    name: 'auth',
    defaults: {
        authUser: null,
    }
})

export class AuthState implements NgxsOnInit {

    constructor(
        private authService: AuthService
    ) {
    }

    @Selector()
    public static authUser(state: AuthModel): AuthUser {
        return state.authUser;
    }

    @Action(AuthUserChanged)
    authUserChanged(ctx: StateContext<AuthModel>, action: AuthUserChanged) {
        const user = action.authUser;
        ctx.setState({ authUser: user });
    }

    @Action(ObserveAuthUser, { cancelUncompleted: true })
    observeAuthUser(ctx: StateContext<AuthModel>) {
        return this.authService.authUser$().pipe(
            map(authUser => {
                return ctx.dispatch(new AuthUserChanged(authUser));
            })
        );
    }

    ngxsOnInit(ctx: StateContext<AuthModel>) {
        ctx.dispatch(new ObserveAuthUser());
    }

}
