import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { PurgeMiniGameArgs } from '@cloud-api/arguments';

@Component({
    templateUrl: './mini-game.component.html',
})
export class MiniGameComponent implements OnInit {

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private cloudData: CloudDataService,
        private authState: AuthStateService
    ) {
    }

    waiting = false;
    hasPlayerData = false;

    ngOnInit(): void {
        /* this.cloudData.collection('players')
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
            .subscribe(); */
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
