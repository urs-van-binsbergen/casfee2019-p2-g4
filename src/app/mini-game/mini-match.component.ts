import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
    templateUrl: './mini-match.component.html',
    styleUrls: ['./mini-match.component.scss']
})
export class MiniMatchComponent implements OnInit {
    title = 'Match';

    waitingPlayers$: Observable<any[]>;
    myBattle$: Observable<any>;

    isInBattle = false;
    uid: string;

    constructor(
        private afs: AngularFirestore,
        private authService: AuthService,
        private fns: AngularFireFunctions
    ) {
    }

    ngOnInit(): void {
        this.uid = this.authService.uid;

        // ( The following is ok when we only want the data
        // ( this.waitingPlayers$ = this.afs.collection<any>('waitingPlayers').valueChanges();

        // https://stackoverflow.com/questions/46900430/firestore-getting-documents-id-from-collection
        // To obtain the id of the documents in a collection, you must use snapshotChanges()

        const waitingPlayers = this.afs.collection<any>('waitingPlayers');
        // .snapshotChanges() returns a DocumentChangeAction[], which contains
        // a lot of information about "what happened" with each change. If you want to
        // get the data and the id use the map operator.
        this.waitingPlayers$ = waitingPlayers.snapshotChanges().pipe(
            map(actions => actions.map(action => {
                    const data = action.payload.doc.data();
                    const id = action.payload.doc.id;
                    const canChallenge = id !== this.uid &&
                        (!data.challenges || !data.challenges.find(x => x.uid === this.uid));
                    return { id, canChallenge, ...data };
                }),
            )
        );
        this.myBattle$ = this.afs.collection('battlePlayers')
            .doc(this.authService.uid).snapshotChanges().pipe(
                map(
                    action => {
                        return action.payload.data();
                    }
                ),
            );
    }

    async challenge(opponentUid) {
        const callable = this.fns.httpsCallable('addChallenge');
        callable({ opponentUid });
    }
}

