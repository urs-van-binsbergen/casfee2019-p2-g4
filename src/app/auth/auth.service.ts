import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable()
export class AuthService {

    constructor(private afAuth: AngularFireAuth) {
        afAuth.user.subscribe(
            result => {
                console.log("observable message", result)
                if (result) {
                    this.isLoggedIn = true;
                    this.userDisplayName = result.email;
                }
                else {
                    this.isLoggedIn = false;
                    this.userDisplayName = null;
                }
            },
            error => {
                console.log("observable error", error); // TODO
            }
        );
    }

    isLoggedIn: boolean;
    userDisplayName: string;

    async login(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.log("promise error", error); // TODO
            });
    }

    async logout() {
        return this.afAuth.auth.signOut()
            .catch(error => {
                console.log("promise error", error); // TODO
            });
    }

    async register(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .catch(error => {
                console.log("promise error", error); // TODO
            });
    }

    async sendPasswordMail(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email)
            .catch(error => {
                console.log("promise error", error); // TODO
            });
    }

}