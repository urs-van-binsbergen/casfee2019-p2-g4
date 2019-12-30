import { Component, OnDestroy, OnInit } from '@angular/core';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { Select, Store } from '@ngxs/store';
import { GameState } from 'src/app/game/state/game.state';
import { Observable } from 'rxjs';
import { Player } from '@cloud-api/core-models';
import { BindGame, UnbindGame } from 'src/app/game/state/game.actions';


@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {

    constructor(
        private cloudFunctions: CloudFunctionsService,
        private store: Store
    ) {
    }

    waiting = false;
    @Select(GameState.player) player$: Observable<Player>;

    ngOnInit(): void {
        this.store.dispatch(new BindGame());
    }

    ngOnDestroy(): void {
        this.store.dispatch(new UnbindGame());
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
