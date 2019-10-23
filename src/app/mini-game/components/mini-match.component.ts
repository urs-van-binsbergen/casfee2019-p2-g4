import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddChallengeArgs } from '@cloud-api/arguments';
import { Player } from '@cloud-api/core-models';

@Component({
    templateUrl: './mini-match.component.html',
    styleUrls: ['./mini-match.component.scss']
})
export class MiniMatchComponent implements OnInit {
    title = 'Match';

    waitingPlayers$: Observable<any[]>;
    player: Player;

    isInBattle = false;
    uid: string;

    constructor(
        private afs: AngularFirestore,
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {

        this.uid = this.authState.currentUser.uid;

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

        this.cloudData.getPlayer(this.authState.currentUser.uid)
            .then(result => this.player = result)
            .catch(error => console.log(error))
        ;
    }

    challenge(opponentUid) {
        var args: AddChallengeArgs = { opponentUid };
        this.cloudFunctions.addChallenge(args);
    }
}

