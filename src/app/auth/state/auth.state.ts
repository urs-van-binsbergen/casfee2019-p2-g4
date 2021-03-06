import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { EMPTY } from 'rxjs';
import { map, tap, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { User } from '@cloud-api/core-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AuthService, AuthUser } from '../auth.service';
import * as AuthActions from './auth.actions';
import { Injectable } from '@angular/core';


export interface AuthStateModel {
    authUid: string | null;
    authUser: AuthUser | null;
    user: User | null; // (db doc, contains more details like player level)

    // Action result models
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
    profileUpdateSuccess: boolean;
}

export interface UpdateProfileResult {
    success: boolean;
    error?: string;
    profileUpdateSuccess: boolean;
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


@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        authUid: null,
        authUser: null,
        user: null
    }
})

@Injectable({ providedIn: 'root' })
export class AuthState implements NgxsOnInit {

    @Selector()
    public static authUid(state: AuthStateModel): string {
        return state.authUid;
    }
    @Selector()
    public static authUser(state: AuthStateModel): AuthUser {
        return state.authUser;
    }

    @Selector()
    public static user(state: AuthStateModel): User {
        return state.user;
    }

    @Selector()
    public static loginResult(state: AuthStateModel): LoginResult {
        return state.loginResult;
    }

    @Selector()
    public static logoutResult(state: AuthStateModel): LogoutResult {
        return state.logoutResult;
    }

    @Selector()
    public static registerResult(state: AuthStateModel): RegisterResult {
        return state.registerResult;
    }

    @Selector()
    public static updateProfileResult(state: AuthStateModel): UpdateProfileResult {
        return state.updateProfileResult;
    }

    @Selector()
    public static updatePasswordResult(state: AuthStateModel): UpdatePasswordResult {
        return state.updatePasswordResult;
    }

    @Selector()
    public static sendPasswordMailResult(state: AuthStateModel): SendPasswordMailResult {
        return state.sendPasswordMailResult;
    }

    constructor(
        private authService: AuthService,
        private cloudFunctions: CloudFunctionsService,
        private cloudData: CloudDataService,
        private notification: NotificationService
    ) {
        // Why cloud services in the auth state? Because db user data handling
        // is included here for reasons of simplicity.
    }

    ngxsOnInit(ctx: StateContext<AuthStateModel>) {
        ctx.dispatch(new AuthActions.ObserveAuthUser());
    }

    @Action(AuthActions.ObserveAuthUser)
    observeAuthUser(ctx: StateContext<AuthStateModel>) {
        return this.authService.authUser$().pipe(
            tap(authUser => {
                ctx.dispatch(new AuthActions.AuthUserChanged(authUser));
            }),
            map(authUser => authUser ? authUser.uid : null),
            distinctUntilChanged(),
            tap(uid => {
                ctx.dispatch(new AuthActions.AuthUidChanged(uid));
            }),
            switchMap(uid => {
                if (uid) {
                    return this.cloudData.getUser$(uid)
                        .pipe(
                            tap(user => {
                                ctx.dispatch(new AuthActions.UserUpdated(user));
                            }),
                            catchError(err => {
                                this.notification.quickErrorToast('common.error.apiReadError', { errorDetail: err });
                                return EMPTY;
                            })
                        );
                } else {
                    ctx.dispatch(new AuthActions.Unauthenticated());
                    return EMPTY;
                }
            }),
            catchError(err => {
                this.notification.quickErrorToast('common.error.genericError', { errorDetail: err });
                return EMPTY;
            })
        );
    }

    @Action(AuthActions.AuthUserChanged)
    authUserChanged(ctx: StateContext<AuthStateModel>, action: AuthActions.AuthUserChanged) {
        ctx.patchState({ authUser: action.authUser });
    }

    @Action(AuthActions.AuthUidChanged)
    authUidChanged(ctx: StateContext<AuthStateModel>, action: AuthActions.AuthUidChanged) {
        ctx.patchState({ authUid: action.authUid });
    }

    @Action(AuthActions.Unauthenticated)
    unauthenticated(ctx: StateContext<AuthStateModel>) {
        ctx.setState({ authUid: null, authUser: null, user: null });
    }

    @Action(AuthActions.UserUpdated)
    userUpdated(ctx: StateContext<AuthStateModel>, action: AuthActions.UserUpdated) {
        ctx.patchState({ user: action.user });
    }

    @Action(AuthActions.Login)
    async login(ctx: StateContext<AuthStateModel>, action: AuthActions.Login) {
        const result = await this.authService.login(action.username, action.password);

        ctx.patchState({ loginResult: { ...result } });
    }

    @Action(AuthActions.Logout)
    async logout(ctx: StateContext<AuthStateModel>) {
        const result = await this.authService.logout();

        ctx.patchState({ logoutResult: { ...result } });
    }

    @Action(AuthActions.Register)
    async register(ctx: StateContext<AuthStateModel>, action: AuthActions.Register) {
        const result = await this.authService.register(action.email, action.password, action.displayName);

        let profileUpdateSuccess: boolean;
        if (result.success) {
            profileUpdateSuccess = await this.updateProfileInDatabase(action.displayName, action.email);
        }

        ctx.patchState({ registerResult: { ...result, profileUpdateSuccess } });
    }

    @Action(AuthActions.UpdateProfile)
    async updateProfile(ctx: StateContext<AuthStateModel>, action: AuthActions.UpdateProfile) {
        const result = await this.authService.updateProfile(action.displayName);

        let profileUpdateSuccess: boolean;
        if (result.success) {
            profileUpdateSuccess = await this.updateProfileInDatabase(action.displayName, action.email);
        }

        ctx.patchState({ updateProfileResult: { ...result, profileUpdateSuccess } });
    }

    private async updateProfileInDatabase(displayName: string, email: string): Promise<boolean> {
        try {
            await this.cloudFunctions.updateUser({
                displayName,
                email,
                avatarFileName: null
            }).toPromise();
            return true;
        } catch (error) {
            return false;
        }
    }

    @Action(AuthActions.UpdatePassword)
    async updatePassword(ctx: StateContext<AuthStateModel>, action: AuthActions.UpdatePassword) {
        const result = await this.authService.updatePassword(action.oldPassword, action.newPassword);

        ctx.patchState({ updatePasswordResult: { ...result } });
    }

    @Action(AuthActions.SendPasswordMail)
    async sendPasswordMail(ctx: StateContext<AuthStateModel>, action: AuthActions.SendPasswordMail) {
        const result = await this.authService.sendPasswordMail(action.email);

        ctx.patchState({ sendPasswordMailResult: { ...result } });
    }

}
