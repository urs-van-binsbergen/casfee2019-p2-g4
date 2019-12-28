import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveAuthUser, AuthUserChanged, Login } from './auth.actions';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from '../auth.service';


export interface AuthModel {
    authUser: AuthUser | null;
    login?: LoginModel;
}

export interface LoginModel {
    success?: boolean;
    badCredentials?: boolean;
    genericError?: string;
}

@State<AuthModel>({
    name: 'auth',
    defaults: {
        authUser: null
    }
})

export class AuthState implements NgxsOnInit {

    @Selector()
    public static authUser(state: AuthModel): AuthUser {
        return state.authUser;
    }

    @Selector()
    public static login(state: AuthModel): LoginModel {
        return state.login;
    }

    constructor(
        private authService: AuthService
    ) {
    }

    ngxsOnInit(ctx: StateContext<AuthModel>) {
        ctx.dispatch(new ObserveAuthUser());
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

    @Action(Login)
    login(ctx: StateContext<AuthModel>, action: Login) {
        ctx.patchState({ login: { success: undefined } });
        this.authService.login(action.username, action.password)
            .then(loginResult => {
                if (!loginResult.success) {
                    if (loginResult.badCredentials) {
                        ctx.patchState({ login: { success: false, badCredentials: true } });
                    } else {
                        ctx.patchState({ login: { success: false, genericError: loginResult.genericError } });
                    }
                } else {
                    ctx.patchState({ login: { success: true } });
                }
                ctx.patchState({ login: undefined }); // (next-reset)
            });

    }

}
