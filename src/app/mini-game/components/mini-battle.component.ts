import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { MakeGuessArgs } from '@cloud-api/mini-game';

@Component({
    templateUrl: './mini-battle.component.html',
})
export class MiniBattleComponent implements OnInit {
    title = 'Battle';

    player$: Observable<any>;

    currentGuess: number;

    constructor(
        private afs: AngularFirestore,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {
        this.player$ = this.afs.collection('players')
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

        const args: MakeGuessArgs = { currentGuess };
        this.cloudFunctions.makeGuess(args);
    }
}
