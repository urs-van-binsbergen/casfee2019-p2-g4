import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription, BehaviorSubject } from 'rxjs';


export interface AuthUser {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
}

/*
 * Service to get the current auth state
 */
@Injectable()
export class AuthStateService implements OnDestroy {

    public currentUser: AuthUser;
    private authStateSubscription: Subscription;
    public currentUser$: BehaviorSubject<AuthUser>;

    constructor(
        private afAuth: AngularFireAuth
    ) {
        this.authStateSubscription = this.afAuth.authState.subscribe(
            firebaseUser => {
                const authUser = firebaseUser ? this.convert(firebaseUser) : null;
                this.currentUser = authUser;
                this.currentUser$.next(authUser);
            }
        );

        this.currentUser$ = new BehaviorSubject<AuthUser>(null);
    }

    /*
     * Convert 'firebase.User' to an technology-agnostic model
     */
    private convert(firebaseUser: firebase.User): AuthUser {
        return {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'no name',
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
        };
    }

    /*
     * Update display name in current local state (use for optimistic updates)
     */
    public updateDisplayName(displayName: string): void {
        const currentUser = this.currentUser$.getValue();
        if (currentUser) {
            const updatedUser = { ...currentUser, displayName };
            this.currentUser$.next(updatedUser);
            this.currentUser = updatedUser;
        }
    }

    ngOnDestroy(): void {
        this.authStateSubscription.unsubscribe();
    }

}
