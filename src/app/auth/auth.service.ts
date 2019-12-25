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
 * Helper: Convert 'firebase.User' to an technology-agnostic model
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

/*
 * Technology-agnostic Auth API
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
     * Login a user
     */
    login(email: string, password: string): Promise<void> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(() => { return; });
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
    register(email: string, password: string, displayName: string): Promise<void> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(async userCredential => {
                await this.updateProfileImpl(userCredential.user, displayName);
            });
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
