import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

    /*
     * Login-State Observable (for consumers which need to be able to 
     * await a result, i.e. AuthGuard). 
     */
    public get isLoggedIn$(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(user => !!user)
        )
    }

    private _firebaseUser: firebase.User;

    constructor(private afAuth: AngularFireAuth) {
        /* TODO: afAuth should not be exposed, but how to bring the shizzle to AuthGuard? */
        this.afAuth.authState.subscribe(
            firebaseUser => {
                this._firebaseUser = firebaseUser;
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
            },
            error => {
                console.error('error from authState subscription', error);
            }
        );
    }

    updateProfile(displayName: string): Promise<void> {
        return this._firebaseUser.updateProfile({ displayName });
    }

    updatePassword(newPassword: string): Promise<void> {
        return this._firebaseUser.updatePassword(newPassword);
    }
}