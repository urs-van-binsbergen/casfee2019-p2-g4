import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { CloudDataService } from '../backend/cloud-data.service';
import { Player } from '@cloud-api/core-models';

@Component({
    selector: 'app-battle',
    templateUrl: './battle.component.html',
    styleUrls: ['./battle.component.scss']
})
export class BattleComponent implements OnInit {

    player: Player | null;

    constructor(
        private router: Router,
        private authState: AuthStateService,
        private cloudData: CloudDataService,
    ) { }

    ngOnInit(): void {
        this.cloudData.getPlayer$(this.authState.currentUser.uid).subscribe(
            player => {
                this.player = player;
            },
            error => {

            }
        );
    }

    onCapitulationClicked() {
        this.router.navigateByUrl('/hall');
    }

}
