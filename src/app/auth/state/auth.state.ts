import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveAuthUser, AuthUserChanged, Login, Register } from './auth.actions';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from '../auth.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';


export interface AuthModel {
    authUser: AuthUser | null;
    login?: LoginModel;
    registration?: RegistrationModel;
}

export interface LoginModel {
    success?: boolean;
    badCredentials?: boolean;
    otherError?: string;
}

export interface RegistrationModel {
    success?: boolean;
    emailInUse?: boolean;
    emailInvalid?: boolean;
    otherError?: string;
    incompleteSave?: boolean; // (on success, but profile update in db failed) 
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

    @Selector()
    public static registration(state: AuthModel): RegistrationModel {
        return state.registration;
    }

    constructor(
        private authService: AuthService,
        private cloudFunctions: CloudFunctionsService // (to update database after registration)
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
    async login(ctx: StateContext<AuthModel>, action: Login) {
        ctx.patchState({ login: { success: undefined } });

        const loginResult = await this.authService.login(action.username, action.password);

        if (loginResult.success) {
            ctx.patchState({ login: { success: true } });
        } else {
            if (loginResult.badCredentials) {
                ctx.patchState({ login: { success: false, badCredentials: true } });
            } else {
                ctx.patchState({ login: { success: false, otherError: loginResult.otherError } });
            }
        }

        ctx.patchState({ login: undefined }); // (next-reset)
    }

    @Action(Register)
    async register(ctx: StateContext<AuthModel>, action: Register) {
        ctx.patchState({ registration: { success: undefined } });

        const registrationResult = await this.authService.register(action.email, action.password, action.displayName);

        let incompleteSave: boolean = undefined;
        if (registrationResult.success) {
            // Update database
            try {
                await this.cloudFunctions.updateUser({
                    displayName: action.displayName,
                    email: action.email,
                    avatarFileName: null
                }).toPromise();
            } catch (error) {
                incompleteSave = true;
            }
        }

        if (registrationResult.success) {
            ctx.patchState({ registration: { success: true, incompleteSave } });
        } else {
            if (registrationResult.emailInUse) {
                ctx.patchState({ registration: { success: false, emailInUse: true } });
            } else if (registrationResult.emailInvalid) {
                ctx.patchState({ registration: { success: false, emailInvalid: true } });
            } else {
                ctx.patchState({ registration: { success: false, otherError: registrationResult.otherError } });
            }
        }

        ctx.patchState({ registration: undefined }); // (next-reset)
    }

}
