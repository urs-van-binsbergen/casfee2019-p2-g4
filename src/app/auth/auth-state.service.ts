import { Injectable, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';


export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string | null;
}

@Injectable()
export class AuthStateService {

    private _currentUser: AuthUser;
    private _firebaseUser: firebase.User;

    constructor(
        private afAuth: AngularFireAuth
    ) {
        this.doSubscribe();
    }

    /*
     * Subscribe to firebase AuthState
     */
    private doSubscribe(): Subscription {
        return this.afAuth.authState.subscribe(
            firebaseUser => this.setCurrentUser(firebaseUser),
            error => console.error('error from authState subscription', error)
        );
    }

    /*
     * Set current User (converts 'firebase.User' to an impl-agnostic model)
     */
    private setCurrentUser(firebaseUser: firebase.User): void {
        if (firebaseUser) {
            this._firebaseUser = firebaseUser;
            this._currentUser = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL
            };
        } else {
            this._firebaseUser = null;
            this._currentUser = null;
        }
    }

    /*
     * Current User (read-only shallow copy)
     */
    public get currentUser() {
        return this._currentUser ? { ...this._currentUser } : null;
    }

    /*
     * Observable login state (for consumers which need to be able to
     * await a result, i.e. AuthGuard).
     */
    public get isLoggedIn$(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(user => !!user)
        );
    }

    /*
     * Update user profile (assumes a current user is available and loaded)
     */
    public async updateProfile(displayName: string) {
        if (!this._firebaseUser) {
            throw new Error('No user available (maybe you should "await"?)');
        }

        await this._firebaseUser.updateProfile({ displayName });
        await this._firebaseUser.getIdToken(true); // forceRefresh! (*)
        this._currentUser.displayName = displayName;

        // (*) so server token will update too. This strangely still does not trigger
        //     the authStateChanged, that's why we update the state ourselves.
    }

    /*
     * Change user password (assumes a current user is available and loaded)
     */
    public updatePassword(oldPassword: string, newPassword: string) {
        if (!this._firebaseUser) {
            throw new Error('No user available (maybe you should "await"?)');
        }

        return this.afAuth.auth.signInWithEmailAndPassword(
            this._firebaseUser.email, oldPassword
        )
            .then(() => {
                this._firebaseUser.updatePassword(newPassword);
            });

        // Why Use signIn...() instead of reauthenticate()?
        // See issue on github:
        // "How to create “credential” object needed by Firebase web user.reauthenticate()
        // method?"
        // https://github.com/angular/angularfire2/issues/491
    }

}
