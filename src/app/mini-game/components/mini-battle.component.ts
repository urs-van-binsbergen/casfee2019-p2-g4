import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Player, PlayerStatus } from '@cloud-api/core-models';

@Component({
    templateUrl: './mini-battle.component.html',
})
export class MiniBattleComponent implements OnInit {
    title = 'Battle';

    player: Player;

    currentGuess: number;

    lastGuessInfo: string;
    isVictory = false;
    isWaterloo = false;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.player = player;
                switch (player.battle.miniGameLastGuessSign) {
                    case -1:
                        this.lastGuessInfo = 'too low';
                        break;
                    case 1:
                        this.lastGuessInfo = 'too high';
                        break;
                    default:
                        this.lastGuessInfo = this.player.playerStatus === PlayerStatus.Victory ? 'perfect!' : '';
                        break;
                }
                this.isVictory = this.player.playerStatus === PlayerStatus.Victory;
                this.isWaterloo = this.player.playerStatus === PlayerStatus.Waterloo;
            },
            error => {

            }
        );
    }

    async submit() {
        const miniGameGuess = this.currentGuess;
        if (!miniGameGuess) {
            alert('number missing'); // TODO
            return;
        }

        const args: ShootArgs = { targetPos: { x: 0, y: 0 }, miniGameGuess };
        console.log(args);
        this.cloudFunctions.shoot(args);
    }
}
