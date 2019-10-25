import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { MakeGuessArgs } from '@cloud-api/arguments';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Player } from '@cloud-api/core-models';

@Component({
    templateUrl: './mini-battle.component.html',
})
export class MiniBattleComponent implements OnInit {
    title = 'Battle';

    player: Player;

    currentGuess: number;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {
        // Load player (once)
        this.cloudData.getPlayer(this.authState.currentUser.uid)
            .then(result => this.player = result)
            .catch(error => console.log(error))
        ;
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
