import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { AddChallengeArgs } from '@cloud-api/arguments';
import { Player, WaitingPlayer } from '@cloud-api/core-models';

@Component({
    templateUrl: './mini-match.component.html',
    styleUrls: ['./mini-match.component.scss']
})
export class MiniMatchComponent implements OnInit {
    title = 'Match';

    waitingPlayers: WaitingPlayer[];
    player: Player;

    isInBattle = false;
    uid: string;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {

        this.uid = this.authState.currentUser.uid;

        // Load player (once)
        this.cloudData.getPlayer(this.uid)
            .then(result => this.player = result)
            .catch(error => console.log(error))
        ;
        
        this.cloudData.getWaitingPlayers$().subscribe(
            waitingPlayers => this.waitingPlayers = waitingPlayers.map(
                waitingPlayer => {
                    const canChallenge = 
                        // it's not me...
                        waitingPlayer.uid !== this.uid &&
                        // ...and I did not already challenge him
                        (!waitingPlayer.challenges || 
                            !waitingPlayer.challenges.find(x => x.uid === this.uid)
                        );
                    return { canChallenge, ...waitingPlayer };
                }
            ),
            error => {}
        );
    }

    challenge(opponentUid) {
        var args: AddChallengeArgs = { opponentUid };
        this.cloudFunctions.addChallenge(args);
    }
}

