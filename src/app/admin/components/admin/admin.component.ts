import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameState } from 'src/app/game/state/game.state';
import { Observable } from 'rxjs';
import { Player } from '@cloud-api/core-models';
import { BindGame, UnbindGame, Delete } from 'src/app/game/state/game.actions';


@Component({
    templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {

    waiting = false;
    @Select(GameState.player) player$: Observable<Player>;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new BindGame());
    }

    ngOnDestroy(): void {
        this.store.dispatch(new UnbindGame());
    }

    purge() {
        this.waiting = true;
        this.store.dispatch(new Delete()).toPromise()
            .finally(() => {
                this.waiting = false;
            })
            ;
    }

}
