import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { PlayerState } from '../../state/player.state';
import { tap, map } from 'rxjs/operators';
import { GameModel, getGameModel } from './game.model';

@Component({
    templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {

    model$: Observable<GameModel>;

    constructor(
        private store: Store,
    ) {
    }

    ngOnInit(): void {
        let oldModel = {};
        this.model$ = this.store.select(PlayerState)
            .pipe(
                map(state => getGameModel(oldModel, state)),
                tap(model => oldModel = model)
            );
    }

}
