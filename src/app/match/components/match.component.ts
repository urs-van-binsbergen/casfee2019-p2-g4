import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import * as MatchMethods from '../match-methods';
import { MatchItem, MatchState } from '../match-models';
import { Router } from '@angular/router';
import { WaitingPlayer } from '@cloud-api/core-models';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html',
    styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {

    private _items: MatchItem[] = [];
    private _state: MatchState = MatchState.Idle;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.subscribeData();
    }

    public get items(): MatchItem[] {
        return this._items;
    }

    public get hasItems(): boolean {
        return this._items && 0 < this._items.length;
    }

    subscribeData(): void {
        const uid = this.authState.currentUser.uid;
        this.cloudData.getWaitingPlayers$().subscribe(
            (waitingPlayers: WaitingPlayer[]) => {
                this._state = MatchMethods.reduceMatchStateWithWaitingPlayers(this._state, waitingPlayers, uid);
                this._items = MatchMethods.reduceMatchItemsWithWaitingPlayers(this._items, waitingPlayers, uid);
                if (this._state === MatchState.Completed) {
                    this.router.navigateByUrl('/battle');
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    public onAddChallenge(item: MatchItem) {
        const opponentUid = item.opponentUid;
        this.cloudFunctions.addChallenge({ opponentUid });
    }

    public onRemoveChallenge(item: MatchItem) {
        const opponentUid = item.opponentUid;
        this.cloudFunctions.removeChallenge({ opponentUid });
    }

}
