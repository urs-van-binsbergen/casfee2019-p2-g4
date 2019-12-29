import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
}

export interface LoginResult {
    success: boolean;
    badCredentials?: boolean;
    genericError?: string;
}

export interface RegistrationResult {
    success: boolean;
    emailInUse?: boolean;
    emailInvalid?: boolean;
}

/*
 * Auth API (facade, not exposing underlying implementation)
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

    /*
     * Locally published profile updates
     * (Because firebase.User.updateProfile() does not fire a next AngularFireAuth.authState)
     */
    private localAuthUserUpdates = new Subject<AuthUser>();

    constructor(
        private afAuth: AngularFireAuth
    ) {
    }

    private getAuthUser(firebaseUser: firebase.User): AuthUser | null {
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

    public authUser$(): Observable<AuthUser> {
        return merge(
            this.afAuth.authState.pipe(map(this.getAuthUser)),
            this.localAuthUserUpdates
        );
    }

    login(email: string, password: string): Promise<LoginResult> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(() => ({ success: true }))
            .catch((error: firebase.FirebaseError) => {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                    return { success: false, badCredentials: true };
                } else {
                    return { success: false, genericError: `${error.message} (${error.code})` };
                }
            });
    }

    logout(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    register(email: string, password: string, displayName: string): Promise<RegistrationResult> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(async userCredential => {
                await this.updateProfileImpl(userCredential.user, displayName);
                return { success: true };
            })
            .catch((error: firebase.FirebaseError) => {
                if (error.code === 'auth/email-already-in-use') {
                    return { success: false, emailInUse: true };
                }
                if (error.code === 'auth/invalid-email') {
                    return { success: false, emailInvalid: true };
                }
                // some other error -> rethrow
                throw error;
            })
            ;
    }

    sendPasswordMail(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    public updateProfile(displayName: string): Promise<void> {
        const firebaseUser = this.afAuth.auth.currentUser;
        return this.updateProfileImpl(firebaseUser, displayName);
    }

    private async updateProfileImpl(firebaseUser: firebase.User, displayName: string): Promise<void> {
        await firebaseUser.updateProfile({ displayName });
        const authUser = this.getAuthUser(firebaseUser);
        this.localAuthUserUpdates.next(authUser);
    }

    public updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        const firebaseUser = this.afAuth.auth.currentUser;
        if (!firebaseUser) {
            throw new Error('No user');
        }

        return this.afAuth.auth.signInWithEmailAndPassword(
            firebaseUser.email, oldPassword
        )
            .then((userCredential) => {
                userCredential.user.updatePassword(newPassword);
            });
    }

}
