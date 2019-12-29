import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { PlayerState } from '../../state/player.state';
import { tap, takeUntil } from 'rxjs/operators';
import { GameModel, getGameModel } from './game.model';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit, OnDestroy {

    model: GameModel = {};
    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
    ) {
    }

    ngOnInit(): void {
        this.store.select(PlayerState)
            .pipe(
                takeUntil(this.destroy$),
                tap(state => this.model = getGameModel(this.model, state))
            )
            .subscribe()
            ;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

}
