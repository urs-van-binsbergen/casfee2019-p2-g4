import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthStateService } from '../../auth/auth-state.service';
import { Player } from '@cloud-api/core-models';
import { map, tap } from 'rxjs/operators';

@Component({
    templateUrl: './mini-game.component.html',
})
export class MiniGameComponent implements OnInit {

    constructor(
        private fns: AngularFireFunctions,
        private afs: AngularFirestore,
        private authState: AuthStateService
    ) {
    }

    waiting = false;
    hasPlayerData = false;

    ngOnInit(): void {
        this.afs.collection('players')
        .doc(this.authState.currentUser.uid).snapshotChanges().pipe(
            map(
                action => {
                    return action.payload.data();
                }
            ),
            tap(
                (x: Player | null) => {
                    this.hasPlayerData = x != null;
                }
            )
        )
        .subscribe();
}

    async purge() {
        this.waiting = true;

        const callable = this.fns.httpsCallable('purgeMiniGame');
        callable({}).toPromise()
            .then(x => {
                this.waiting = false;
            })
            .catch(err => {
                this.waiting = false;
            })
            ;
    }
}
