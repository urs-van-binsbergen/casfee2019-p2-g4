import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {

    constructor(public afAuth: AngularFireAuth) {
        afAuth.user.subscribe(
            result => {
                if (result) {
                    this.isLoggedIn = true;
                    this.userDisplayName = result.email;
                    this.uid = result.uid;
                } else {
                    this.isLoggedIn = false;
                    this.userDisplayName = null;
                    this.uid = null;
                }
            },
            error => {
                console.log('observable error', error); // TODO
            }
        );
    }

    isLoggedIn: boolean;
    userDisplayName: string;
    uid: string;

    // TODO: probably we should not expose firebase api here

    login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    logout(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    register(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    sendPasswordMail(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

}
