import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string | null;
}

@Injectable()
export class AuthStateService {
    
    public currentUser: AuthUser;
    public _firebaseUser: User;

    constructor(public afAuth: AngularFireAuth) {
        /* TODO: afAuth should not be exposed, but how to bring the shizzle to AuthGuard? */
        afAuth.authState.subscribe(
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
        if(!this._firebaseUser) {
            throw "No user"; // TODO
        }
        return this._firebaseUser.updateProfile({ displayName });
    }

    updatePassword(newPassword: string): Promise<void> {
        if(!this._firebaseUser) {
            throw "No user"; // TODO
        }
        return this._firebaseUser.updatePassword(newPassword);
    }
}