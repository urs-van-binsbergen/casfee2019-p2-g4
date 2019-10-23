import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthStateService } from '../../auth/auth-state.service';
import { Player } from '@cloud-api/core-models';
import { map, tap } from 'rxjs/operators';
import { PurgeMiniGameArgs } from '@cloud-api/mini-game';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';

@Component({
    templateUrl: './mini-game.component.html',
})
export class MiniGameComponent implements OnInit {

    constructor(
        private cloudFunctions: CloudFunctionsService,
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
                    (x: Player | null) => {
                        this.hasPlayerData = x != null;
                    }
                )
            )
            .subscribe();
    }

    async purge() {
        this.waiting = true;

        const args: PurgeMiniGameArgs = {};
        this.cloudFunctions.purgeMiniGame(args).toPromise()
            .then(results => {
                this.waiting = false;
            })
            .catch(error => {
                this.waiting = false;
            })
            ;
    }
}
