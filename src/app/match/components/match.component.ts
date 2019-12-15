import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthStateService } from '../../auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import * as MatchMethods from '../match-methods';
import { MatchItem, MatchState } from '../match-models';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WaitingPlayer } from '@cloud-api/core-models';

@Component({
    selector: 'app-match',
    templateUrl: './match.component.html'
})
export class MatchComponent implements OnInit, OnDestroy {

    private _items: MatchItem[] = [];
    private _state: MatchState = MatchState.Idle;
    private _waiting: boolean;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService,
        private snackBar: MatSnackBar,
        private translate: TranslateService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.subscribeData();
    }

    ngOnDestroy(): void {
        this.hideError();
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

    subscribeData(): void {
        const uid = this.authState.currentUser.uid;
        this.cloudData.getWaitingPlayers$().subscribe(
            (waitingPlayers: WaitingPlayer[]) => {
                this.hideError();
                this._state = MatchMethods.updateMatchStateWithWaitingPlayers(this._state, waitingPlayers, uid);
                this._items = MatchMethods.updateMatchItemsWithWaitingPlayers(this._items, waitingPlayers, uid);
            },
            error => {
                this.showError('match.error.waitingPlayers');
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

    public onCancelClicked() {
        this._waiting = true;
        this.hideError();
        this.cloudFunctions.removePreparation({}).toPromise()
            .then(results => {
                this._waiting = false;
                this.router.navigateByUrl('/hall');
            })
            .catch(error => {
                this._waiting = false;
                this.showError('match.error.cancel');
            });
    }

    private hideError() {
        this.snackBar.dismiss();
    }

    private showError(error: string) {
        const message = this.translate.instant(error);
        const close = this.translate.instant('button.close');
        this.snackBar.open(message, close);
    }

}
