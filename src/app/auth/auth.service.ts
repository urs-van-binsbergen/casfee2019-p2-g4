import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthStateService } from './auth-state.service';

/*
 * Service implementing the typical auth actions
 */
@Injectable()
export class AuthService {

    constructor(
        private afAuth: AngularFireAuth,
        private authState: AuthStateService
    ) {

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
                this.authState.updateDisplayName(displayName); // optimistic update
            });
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
