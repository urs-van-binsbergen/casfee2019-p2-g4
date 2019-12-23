import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../../auth/auth-state.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { Select } from '@ngxs/store';
import { PlayerState, PlayerModel } from 'src/app/game/state/player.state';
import { Observable } from 'rxjs';
import { Player } from '@cloud-api/core-models';


@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

    constructor(
        private cloudFunctions: CloudFunctionsService,
    ) {
    }

    waiting = false;
    @Select(PlayerState.player) player$: Observable<Player>;

    ngOnInit(): void {
    }

    purge() {
        this.waiting = true;

        const args = {};
        this.cloudFunctions.deleteGameData(args).toPromise()
            .finally(() => {
                this.waiting = false;
            })
            ;
    }

}
