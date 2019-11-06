import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { AuthStateService } from 'src/app/auth/auth-state.service';
import { BattleBoard, createRowsAndFields, Field } from '../battle-models';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { ShootArgs } from '@cloud-api/arguments';
import { PlayerInfo, PlayerStatus } from '@cloud-api/core-models';

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

                    const targetBoard = player.battle.targetBoard;
                    const targetRows = createRowsAndFields(targetBoard);
                    const canShoot = player.canShootNext;
                    this.targetBoard = new BattleBoard(targetRows, targetBoard.ships, canShoot);

                    const ownBoard = player.board;
                    const ownRows = createRowsAndFields(ownBoard);
                    this.ownBoard = new BattleBoard(ownRows, ownBoard.ships, false);

                    this.isVictory = player.playerStatus === PlayerStatus.Victory;
                    this.isWaterloo = player.playerStatus === PlayerStatus.Waterloo;
                    }
                else {
                    this.targetBoard = null;
                    this.ownBoard = null;
                }
            },
            error => {

            }
        );
    }

    onShoot(field: Field) {
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
