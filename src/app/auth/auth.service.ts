import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {

    constructor(private afAuth: AngularFireAuth) { }

    // TODO: probably we should not expose firebase api here

    login(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    logout(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    async register(email: string, password: string, displayName: string): Promise<void> {
        const userCred = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        
    }

    sendPasswordMail(email: string): Promise<void> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

}
