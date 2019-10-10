import { Injectable } from '@angular/core';
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

/*
 * Service to track the current auth state
 * (logged in? if so, user details?)
 */
@Injectable()
export class AuthStateService {

    public currentUser: AuthUser;

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
            firebaseUser => {
                console.log('authStateChanged');
                const authUser = this.convert(firebaseUser);
                this.currentUser = authUser;
            },
            error => console.error('error from authState subscription', error)
        );
    }

    /*
     * Converts 'firebase.User' to an impl-agnostic model
     */
    private convert(firebaseUser: firebase.User): AuthUser {
        if (!firebaseUser) {
            return null;
        }
        return {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'no name',
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL
        };
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

}