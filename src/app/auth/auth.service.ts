import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';

/*
 * Model representing the currently logged in user
 */
export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
}

/*
 * Helper: Convert 'firebase.User' to a technology-agnostic model
 */
function getAuthUser(firebaseUser: firebase.User): AuthUser | null {
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
 * Auth API
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(
        private afAuth: AngularFireAuth
    ) {
    }

    /*
     * Locally published profile updates
     * (Because firebase.User.updateProfile() does not fire a next AngularFireAuth.authState)
     */
    private localAuthUserUpdates = new Subject<AuthUser>();

    /*
     * Currently logged-in user
     */
    public authUser$(): Observable<AuthUser> {
        return merge(
            this.afAuth.authState.pipe(map(getAuthUser)),
            this.localAuthUserUpdates
        );
    }

    /*
     * Login a user (returns false on bad credentials and true on success)
     */
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

    /*
     * Logout the current user
     */
    logout(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    /*
     * Register a new user
     */
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

    /*
     * Send a mail with a link to reset the password
     */
    sendPasswordMail(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    /*
     * Update logged-in user's display name
     */
    public updateProfile(displayName: string): Promise<void> {
        const firebaseUser = this.afAuth.auth.currentUser;
        return this.updateProfileImpl(firebaseUser, displayName);
    }

    /*
    * Update user's profile (private impl.)
    */
    private updateProfileImpl(firebaseUser: firebase.User, displayName: string): Promise<void> {
        return firebaseUser.updateProfile({ displayName })
            .then(() => {
                const authUser = getAuthUser(firebaseUser);
                this.localAuthUserUpdates.next(authUser);
            })
            ;
    }

    /*
     * Update logged-in user's password
     */
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
