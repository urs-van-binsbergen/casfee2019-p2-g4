import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { map } from 'rxjs/operators';

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
        private authService: AuthService,
        private fns: AngularFireFunctions
    ) {
    }

    ngOnInit(): void {
        this.myBattle$ = this.afs.collection('battlePlayers')
            .doc(this.authService.uid).snapshotChanges().pipe(
                map(
                    action => {
                        return action.payload.data();
                    }
                ),
            );
    }

    async submit() {
        const currentGuess = this.currentGuess
        if(!currentGuess) {
            alert('number missing'); // TODO
            return;
        }
        const callable = this.fns.httpsCallable('makeGuess');
        this.serviceResult$ = callable({ currentGuess });
    }
}
