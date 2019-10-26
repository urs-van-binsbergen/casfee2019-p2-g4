import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthStateService } from './auth-state.service';
import { CloudFunctionsService } from '../backend/cloud-functions.service';

/*
 * Service to communicate with the auth backend
 */
@Injectable()
export class AuthService {

    constructor(
        private _afAuth: AngularFireAuth,
        private _authState: AuthStateService,
        private _cloudFunctions: CloudFunctionsService
    ) {

    }

    /*
     * Login a user
     */
    login(email: string, password: string): Promise<void> {
        return this._afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => { return; });
    }

    /*
     * Logut the current user
     */
    logout(): Promise<void> {
        return this._afAuth.auth.signOut();
    }

    /*
     * Register a new user
     */
    register(email: string, password: string, displayName: string): Promise<void> {
        return this._afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                this.updateProfileImpl(userCredential.user, displayName);
            });
    }

    /*
     * Send a mail with a link to reset the password
     */
    sendPasswordMail(email: string): Promise<void> {
        return this._afAuth.auth.sendPasswordResetEmail(email);
    }

    /*
    * Update logged-in user's profile
    */
    public updateProfile(displayName: string): Promise<void> {
        const firebaseUser = this._afAuth.auth.currentUser;
        return this.updateProfileImpl(firebaseUser, displayName);
    }

    /*
    * Update user's profile (private impl.)
    */
    private updateProfileImpl(firebaseUser: firebase.User, displayName: string): Promise<void> {
        if (!firebaseUser) {
            throw new Error('No user');
        }

        return firebaseUser.updateProfile({ displayName })
            .then(() => { firebaseUser.getIdToken(true); }) // forceRefresh! (*)
            .then(() => { this._authState.currentUser.displayName = displayName; })
            .then(() => {
                this._cloudFunctions.updateUser({
                    displayName,
                    avatarFileName: null,
                    email: firebaseUser.email
                });
            })
            ;

        // (*) so server token will update too. This strangely still does not trigger
        //     the authStateChanged, that's why we update the state ourselves.
    }

    /*
     * Update logged-in user's password
     */
    public updatePassword(oldPassword: string, newPassword: string): Promise<void> {
        const firebaseUser = this._afAuth.auth.currentUser;
        if (!firebaseUser) {
            throw new Error('No user');
        }

        return this._afAuth.auth.signInWithEmailAndPassword(
            firebaseUser.email, oldPassword
        )
            .then((userCredential) => {
                userCredential.user.updatePassword(newPassword);
            });
    }

}
