import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Player, PlayerStatus } from '@cloud-api/core-models';
import { getPosFromIndex } from '@cloud-api/core-methods';

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
        const currentGuess = this.currentGuess;
        if (!currentGuess) {
            alert('currentGuess missing'); // TODO
            return;
        }

        // Mode 1: Fully working ship battle (with poor UX) -> toggle by commenting-in
        // 1) Save a layout using '/preparation' (instead of 'mini-game/prep').
        // 2) Come back to mini game > Start > Next... > Make a match
        // 3) Go to battle (here)
        //    Submit a number between 1 and 64 to shoot a field on the board (numbered from top-left)
        //    Shoot until victory or waterloo.
        // const targetPos = getPosFromIndex(currentGuess - 1, { w: 8, h: 8 });
        // const miniGameGuess = 0;

        // Mode 2: plain number guessing game:
        const miniGameGuess = currentGuess;
        const targetPos = { x: 0, y: 0 };

        const args: ShootArgs = { targetPos, miniGameGuess };
        console.log(args);
        this.cloudFunctions.shoot(args);
    }
}
