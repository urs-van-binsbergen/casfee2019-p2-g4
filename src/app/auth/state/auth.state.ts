import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveUser, UpdateUser } from './auth.actions';
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

    @Action(UpdateUser)
    updateUser(ctx: StateContext<AuthModel>, action: UpdateUser) {
        const user = action.authUser;
        ctx.setState({ authUser: user });
    }

    @Action(ObserveUser, { cancelUncompleted: true })
    observeUser(ctx: StateContext<AuthModel>) {
        return this.authService.authUser$().pipe(
            map(authUser => {
                return ctx.dispatch(new UpdateUser(authUser));
            })
        );
    }

    ngxsOnInit(ctx: StateContext<AuthModel>) {
        ctx.dispatch(new ObserveUser());
    }

}
