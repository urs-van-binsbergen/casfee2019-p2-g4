import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, BattleField } from '../battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';
import * as battleMethods from '../battle-methods';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

    targetBoard: BattleBoard | null = null;
    ownBoard: BattleBoard | null = null;
    opponentInfo: PlayerInfo | null = null;
    isVictory = false;
    isWaterloo = false;

    constructor(
        private router: Router,
        private authState: AuthStateService,
        private cloudData: CloudDataService,
        private cloudFunctions: CloudFunctionsService
    ) { }

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                if (player && player.battle) {
                    this.opponentInfo = player.battle.opponentInfo;
                    this.targetBoard = battleMethods.createTargetBoard(player);
                    this.ownBoard = battleMethods.createOwnBoard(player);
                    this.isVictory = player.playerStatus === PlayerStatus.Victory;
                    this.isWaterloo = player.playerStatus === PlayerStatus.Waterloo;
                } else {
                    this.opponentInfo = null;
                    this.targetBoard = null;
                    this.ownBoard = null;
                    this.isVictory = false;
                    this.isWaterloo = false;
                }
            },
            error => {

            }
        );
    }

    onShoot(field: BattleField) {
        if (!this.targetBoard.canShoot || !field.shootable) {
            return;
        }

        field.shooting = true;
        const args: ShootArgs = {
            targetPos: field.pos,
            miniGameGuess: null
        }
        this.cloudFunctions.shoot(args).toPromise()
            .then(results => {
                field.shooting = false;
            })
            ;
    }

    onCapitulationClicked() {
        this.router.navigateByUrl('/hall');
    }

}
