import { Component, OnInit, OnDestroy } from '@angular/core';
import * as MatchMethods from '../model/match-methods';
import { MatchItem, MatchStatus } from '../model/match-models';
import { Router } from '@angular/router';
import { WaitingPlayer } from '@cloud-api/core-models';
import { Select, Store } from '@ngxs/store';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Observable } from 'rxjs';
import { MatchState } from '../state/match.state';
import { AddChallenge, BindMatch, CancelMatch, RemoveChallenge, UnbindMatch } from '../state/match.actions';
import deepClone from 'clone-deep';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html'
})
export class MatchComponent implements OnInit, OnDestroy {

    private _items: MatchItem[] = [];
    private _state: MatchStatus = MatchStatus.Idle;
    private _waiting: boolean;

    @Select(MatchState.loading) loading$: Observable<boolean>;
    @Select(MatchState.waitingPlayers) waitingPlayers$: Observable<WaitingPlayer[]>;

    constructor(
        private store: Store,
        private router: Router) {
    }

    ngOnInit(): void {
        const uid = this.store.selectSnapshot(AuthState.authUser).uid;
        this.waitingPlayers$.subscribe((waitingPlayers: WaitingPlayer[]) => {
            this._state = MatchMethods.updateMatchStatusWithWaitingPlayers(this._state, waitingPlayers, uid);
            this._items = MatchMethods.updateMatchItemsWithWaitingPlayers(this._items, waitingPlayers, uid);
        });
        this.store.dispatch(new BindMatch());
    }

    ngOnDestroy(): void {
        this.store.dispatch(new UnbindMatch());
    }

    public get items(): MatchItem[] {
        return this._items;
    }

    public get hasItems(): boolean {
        return this._items && 0 < this._items.length;
    }

    get isWaiting(): boolean {
        return this._waiting;
    }

    public onAddChallenge(item: MatchItem) {
        this.store.dispatch(new AddChallenge(item.opponentUid)).toPromise()
            .catch(error => {
                this._items = deepClone(this._items);
            });
    }

    public onRemoveChallenge(item: MatchItem) {
        this.store.dispatch(new RemoveChallenge(item.opponentUid)).toPromise()
            .catch(error => {
                this._items = deepClone(this._items);
            });
    }

    public onCancelClicked() {
        this._waiting = true;
        this.store.dispatch(new CancelMatch()).toPromise()
            .then(results => {
                this.router.navigateByUrl('/hall');
            })
            .finally(() => {
                this._waiting = false;
            });
    }

}
