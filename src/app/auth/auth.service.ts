import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

/*
 * Auth API
 * - Facade (not exposing underlying implementation)
 * - Returning result objects (catching and interpreting exceptions)
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

    private toAuthUser(firebaseUser: any): AuthUser | null {
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
            await this.afAuth.signInWithEmailAndPassword(email, password);
            return ({ success: true });
        } catch (error) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                return { success: false, badCredentials: true };
            } else {
                return { success: false, otherError: error.toString() };
            }
        }
    }

    async logout(): Promise<LogoutResult> {
        try {
            await this.afAuth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.toString() };
        }
    }

    async register(email: string, password: string, displayName: string): Promise<RegistrationResult> {
        try {
            const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
            await this.updateProfileImpl(userCredential.user, displayName);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, emailInUse: true };
            }
            if (error.code === 'auth/invalid-email') {
                return { success: false, invalidEmail: true };
            } else {
                return { success: false, otherError: error.toString() };
            }
        }
    }

    async updateProfile(displayName: string): Promise<UpdateProfileResult> {
        try {
            const firebaseUser = await this.afAuth.currentUser;
            await this.updateProfileImpl(firebaseUser, displayName);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.toString() };
        }
    }

    private async updateProfileImpl(firebaseUser: any, displayName: string): Promise<void> {
        await firebaseUser.updateProfile({ displayName });
        const authUser = this.toAuthUser(firebaseUser);
        this.localAuthUserUpdates.next(authUser);
    }

    async updatePassword(oldPassword: string, newPassword: string): Promise<UpdatePasswordResult> {
        try {
            const firebaseUser = await this.afAuth.currentUser;
            const userCredential = await this.afAuth.signInWithEmailAndPassword(firebaseUser.email, oldPassword);
            userCredential.user.updatePassword(newPassword);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                return { success: false, wrongPassword: true };
            } else {
                return { success: false, otherError: error.toString() };
            }
        }
    }

    async sendPasswordMail(email: string): Promise<SendPasswordMailResult> {
        try {
            await this.afAuth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                return { success: false, invalidEmail: true };
            }
            if (error.code === 'auth/user-not-found') {
                return { success: false, userNotFound: true };
            } else {
                return { success: false, otherError: error.toString() };
            }
        }
    }

}
