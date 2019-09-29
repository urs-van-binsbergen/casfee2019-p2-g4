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

@Injectable()
export class AuthStateService {

    /*
     * Current User
     */
    public currentUser: AuthUser;

    constructor(private afAuth: AngularFireAuth) {
        this.doSubscribe();
    }

    /*
     * Subscribe to firebase AuthState
     */
    private doSubscribe(): Subscription {
        return this.afAuth.authState.subscribe(
            firebaseUser =>  this.setCurrentUser(firebaseUser),
            error => console.error('error from authState subscription', error)
        );
    }

    /*
     * Set current User (converts firebase user to neutral model)
     */
    private setCurrentUser(firebaseUser: firebase.User): void {
        if (firebaseUser) {
            this.currentUser = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL
            };
        } else {
            this.currentUser = null;
        }
    }

    /*
     * Login-State Observable (for consumers which need to be able to 
     * await a result, i.e. AuthGuard). 
     */
    public get isLoggedIn$(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(user => !!user)
        )
    }

    /*
     * Update user profile
     */
    public async updateProfile(firebaseUser: firebase.User, displayName: string) {
        if(this.currentUser == null || this.currentUser.uid != firebaseUser.uid) {
            throw "Update profile only for the currently logged-in user";
        }
        await firebaseUser.updateProfile({ displayName });
        this.currentUser.displayName = displayName;
    }

}