import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../auth/auth-state.service';

@Component({
    templateUrl: './mini-battle.component.html',
})
export class MiniBattleComponent implements OnInit {
    title = 'Battle';

    myBattle$: Observable<any>;
    serviceResult$: Observable<any>;

    currentGuess: number;

    constructor(
        private afs: AngularFirestore,
        private authState: AuthStateService,
        private fns: AngularFireFunctions
    ) {
    }

    ngOnInit(): void {
        this.myBattle$ = this.afs.collection('battlePlayers')
            .doc(this.authState.currentUser.uid).snapshotChanges().pipe(
                map(
                    action => {
                        return action.payload.data();
                    }
                ),
            );
    }

    async submit() {
        const currentGuess = this.currentGuess;
        if (!currentGuess) {
            alert('number missing'); // TODO
            return;
        }
        const callable = this.fns.httpsCallable('makeGuess');
        this.serviceResult$ = callable({ currentGuess });
    }
}
