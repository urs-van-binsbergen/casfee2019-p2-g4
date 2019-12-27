import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { PlayerState } from '../../state/player.state';
import { tap, map, takeUntil } from 'rxjs/operators';
import { GameModel, getGameModel } from './game.model';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {

    model: GameModel = {};
    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
    ) {
    }

    ngOnInit(): void {
        this.store.select(PlayerState)
            .pipe(
                tap(state => this.model = getGameModel(this.model, state)),
                takeUntil(this.destroy$)
            )
            .subscribe()
            ;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
