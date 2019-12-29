import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { ObserveAuthUser, AuthUserChanged, Login, Logout, Register, UpdateProfile, UpdatePassword, SendPasswordMail } from './auth.actions';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from '../auth.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';


export interface AuthModel {
    authUser: AuthUser | null;

    // Action progress models:
    login?: LoginModel;
    logout?: LogoutModel;
    registration?: RegistrationModel;
    updateProfile?: UpdateProfileModel;
    updatePassword?: UpdatePasswordModel;
    sendPasswordMail?: SendPasswordMailModel;
}

export interface LoginModel {
    success?: boolean;
    badCredentials?: boolean;
    otherError?: string;
}

export interface LogoutModel {
    success?: boolean;
    error?: string;
}

export interface RegistrationModel {
    success?: boolean;
    emailInUse?: boolean;
    invalidEmail?: boolean;
    otherError?: string;
    incompleteSave?: boolean; // (on success, but profile update in db failed)
}

export interface UpdateProfileModel {
    success?: boolean;
    error?: string;
}

export interface UpdatePasswordModel {
    success?: boolean;
    wrongPassword?: boolean;
    otherError?: string;
}

export interface SendPasswordMailModel {
    success?: boolean;
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
    public static login(state: AuthModel): LoginModel {
        return state.login;
    }

    @Selector()
    public static logout(state: AuthModel): LoginModel {
        return state.logout;
    }

    @Selector()
    public static registration(state: AuthModel): RegistrationModel {
        return state.registration;
    }

    @Selector()
    public static updateProfile(state: AuthModel): UpdateProfileModel {
        return state.updateProfile;
    }

    @Selector()
    public static updatePassword(state: AuthModel): UpdatePasswordModel {
        return state.updatePassword;
    }

    @Selector()
    public static sendPasswordMail(state: AuthModel): SendPasswordMailModel {
        return state.sendPasswordMail;
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

        const result = await this.authService.login(action.username, action.password);

        ctx.patchState({
            login: {
                success: result.success,
                badCredentials: result.badCredentials,
                otherError: result.otherError
            }
        });

        ctx.patchState({ login: undefined });
    }

    @Action(Logout)
    async logout(ctx: StateContext<AuthModel>) {
        ctx.patchState({ logout: { success: undefined } });

        const result = await this.authService.logout();

        ctx.patchState({
            logout: {
                success: result.success, 
                error: result.error
            }
        });

        ctx.patchState({ logout: undefined });
    }

    @Action(Register)
    async register(ctx: StateContext<AuthModel>, action: Register) {
        ctx.patchState({ registration: { success: undefined } });

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

        ctx.patchState({
            registration: {
                success: result.success,
                emailInUse: result.emailInUse,
                invalidEmail: result.invalidEmail,
                otherError: result.otherError,
                incompleteSave
            }
        });

        ctx.patchState({ registration: undefined }); // (next-reset)
    }

    @Action(UpdateProfile)
    async updateProfile(ctx: StateContext<AuthModel>, action: UpdateProfile) {
        ctx.patchState({ updateProfile: { success: undefined } });

        const result = await this.authService.updateProfile(action.displayName);

        ctx.patchState({
            updateProfile: {
                success: result.success,
                error: result.error
            }
        });

        ctx.patchState({ updateProfile: undefined });
    }

    @Action(UpdatePassword)
    async updatePassword(ctx: StateContext<AuthModel>, action: UpdatePassword) {
        ctx.patchState({ updatePassword: { success: undefined } });

        const result = await this.authService.updatePassword(action.oldPassword, action.newPassword);

        ctx.patchState({
            updatePassword: {
                success: result.success,
                wrongPassword: result.wrongPassword,
                otherError: result.otherError
            }
        });

        ctx.patchState({ updatePassword: undefined });
    }

    @Action(SendPasswordMail)
    async sendPasswordMail(ctx: StateContext<AuthModel>, action: SendPasswordMail) {
        ctx.patchState({ sendPasswordMail: { success: undefined } });

        const result = await this.authService.sendPasswordMail(action.email);

        ctx.patchState({
            sendPasswordMail: {
                success: result.success,
                userNotFound: result.userNotFound,
                invalidEmail: result.invalidEmail,
                otherError: result.otherError
            }
        });

        ctx.patchState({ sendPasswordMail: undefined });
    }

}
