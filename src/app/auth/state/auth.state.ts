import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveAuthUser, AuthUserChanged, Login, Logout, Register, UpdateProfile, UpdatePassword, SendPasswordMail } from './auth.actions';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from '../auth.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';


export interface AuthModel {
    authUser: AuthUser | null;

    // Action result models:
    loginResult?: LoginResult;
    logoutResult?: LogoutResult;
    registerResult?: RegisterResult;
    updateProfileResult?: UpdateProfileResult;
    updatePasswordResult?: UpdatePasswordResult;
    sendPasswordMailResult?: SendPasswordMailResult;
}

export interface LoginResult {
    success: boolean;
    badCredentials?: boolean;
    otherError?: string;
}

export interface LogoutResult {
    success: boolean;
    error?: string;
}

export interface RegisterResult {
    success: boolean;
    emailInUse?: boolean;
    invalidEmail?: boolean;
    otherError?: string;
    incompleteSave?: boolean; // (when auth reg success, but profile update in db failed)
}

export interface UpdateProfileResult {
    success: boolean;
    error?: string;
}

export interface UpdatePasswordResult {
    success: boolean;
    wrongPassword?: boolean;
    otherError?: string;
}

export interface SendPasswordMailResult {
    success: boolean;
    userNotFound?: boolean;
    invalidEmail?: boolean;
    otherError?: string;
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
    public static loginResult(state: AuthModel): LoginResult {
        return state.loginResult;
    }

    @Selector()
    public static logoutResult(state: AuthModel): LogoutResult {
        return state.logoutResult;
    }

    @Selector()
    public static registerResult(state: AuthModel): RegisterResult {
        return state.registerResult;
    }

    @Selector()
    public static updateProfileResult(state: AuthModel): UpdateProfileResult {
        return state.updateProfileResult;
    }

    @Selector()
    public static updatePasswordResult(state: AuthModel): UpdatePasswordResult {
        return state.updatePasswordResult;
    }

    @Selector()
    public static sendPasswordMailResult(state: AuthModel): SendPasswordMailResult {
        return state.sendPasswordMailResult;
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
        const result = await this.authService.login(action.username, action.password);

        ctx.patchState({ loginResult: { ...result } });
    }

    @Action(Logout)
    async logout(ctx: StateContext<AuthModel>) {
        const result = await this.authService.logout();

        ctx.patchState({ logoutResult: { ...result } });
    }

    @Action(Register)
    async register(ctx: StateContext<AuthModel>, action: Register) {
        const result = await this.authService.register(action.email, action.password, action.displayName);

        let incompleteSave: boolean;
        if (result.success) {
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

        ctx.patchState({ registerResult: { ...result, incompleteSave } });
    }

    @Action(UpdateProfile)
    async updateProfile(ctx: StateContext<AuthModel>, action: UpdateProfile) {
        const result = await this.authService.updateProfile(action.displayName);

        ctx.patchState({ updateProfileResult: { ...result } });
    }

    @Action(UpdatePassword)
    async updatePassword(ctx: StateContext<AuthModel>, action: UpdatePassword) {
        const result = await this.authService.updatePassword(action.oldPassword, action.newPassword);

        ctx.patchState({ updatePasswordResult: { ...result } });
    }

    @Action(SendPasswordMail)
    async sendPasswordMail(ctx: StateContext<AuthModel>, action: SendPasswordMail) {
        const result = await this.authService.sendPasswordMail(action.email);

        ctx.patchState({ sendPasswordMailResult: { ...result } });
    }

}
