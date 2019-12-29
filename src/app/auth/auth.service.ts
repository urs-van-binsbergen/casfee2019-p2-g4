import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

/*
 * Auth API
 * - Facade (not exposing underlying implementation)
 * - Returning result objects (catching and partly interpreting exceptions)
 */

export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
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

export interface RegistrationResult {
    success: boolean;
    emailInUse?: boolean;
    invalidEmail?: boolean;
    otherError?: string;
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

@Injectable({ providedIn: 'root' })
export class AuthService {

    /*
     * Self-triggered profile updates
     * (Because firebase.User.updateProfile() does not fire a next AngularFireAuth.authState)
     */
    private localAuthUserUpdates = new Subject<AuthUser>();

    constructor(
        private afAuth: AngularFireAuth
    ) {
    }

    private toAuthUser(firebaseUser: firebase.User): AuthUser | null {
        if (!firebaseUser) {
            return null;
        }
        return {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'no name',
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
        };
    }

    authUser$(): Observable<AuthUser> {
        return merge(
            this.afAuth.authState.pipe(map(this.toAuthUser)),
            this.localAuthUserUpdates
        );
    }

    async login(email: string, password: string): Promise<LoginResult> {
        try {
            await this.afAuth.auth.signInWithEmailAndPassword(email, password);
            return ({ success: true });
        } catch (error) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                return { success: false, badCredentials: true };
            } else {
                return { success: false, otherError: `${error.message} (${error.code})` };
            }
        }
    }

    async logout(): Promise<LogoutResult> {
        try {
            await this.afAuth.auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: `${error.message} (${error.code})` };
        }
    }

    async register(email: string, password: string, displayName: string): Promise<RegistrationResult> {
        try {
            const userCredential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            await this.updateProfileImpl(userCredential.user, displayName);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, emailInUse: true };
            }
            if (error.code === 'auth/invalid-email') {
                return { success: false, invalidEmail: true };
            } else {
                return { success: false, otherError: `${error.message} (${error.code})` };
            }
        }
    }

    async updateProfile(displayName: string): Promise<UpdateProfileResult> {
        try {
            const firebaseUser = this.afAuth.auth.currentUser;
            this.updateProfileImpl(firebaseUser, displayName);
            return { success: true };
        } catch (error) {
            return { success: false, error: `${error.message} (${error.code})` };
        }
    }

    private async updateProfileImpl(firebaseUser: firebase.User, displayName: string): Promise<void> {
        await firebaseUser.updateProfile({ displayName });
        const authUser = this.toAuthUser(firebaseUser);
        this.localAuthUserUpdates.next(authUser);
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<UpdatePasswordResult> {
        try {
            const firebaseUser = this.afAuth.auth.currentUser;
            const userCredential = await this.afAuth.auth.signInWithEmailAndPassword(firebaseUser.email, oldPassword);
            userCredential.user.updatePassword(newPassword);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                return { success: false, wrongPassword: true };
            } else {
                return { success: false, otherError: `${error.message} (${error.code})` };
            }
        }
    }

    async sendPasswordMail(email: string): Promise<SendPasswordMailResult> {
        try {
            await this.afAuth.auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                return { success: false, invalidEmail: true };
            }
            if (error.code === 'auth/user-not-found') {
                return { success: false, userNotFound: true };
            } else {
                return { success: false, otherError: `${error.message} (${error.code})` };
            }
        }
    }

}
