import { Injectable } from '@angular/core';
import { AuthStateService } from '../auth/auth-state.service';
import { CloudDataService } from 'src/app/backend/cloud-data.service';
import { CloudFunctionsService } from 'src/app/backend/cloud-functions.service';
import { MatchItem } from './match-item';
import { Observable, Subject } from 'rxjs';
import { WaitingPlayer, Challenge } from '@cloud-api/core-models';

enum MatchState {
    Idle,
    Started,
    Completed
}

@Injectable()
export class MatchService {

    private _items: MatchItem[];
    private _uid: string;
    private _state: MatchState;
    private _isMatchCompleted$: Subject<boolean>;

    constructor(
        private cloudData: CloudDataService,
        private authState: AuthStateService,
        private cloudFunctions: CloudFunctionsService) {
        this._uid = this.authState.currentUser.uid;
        this._state = MatchState.Idle;
        this._isMatchCompleted$ = new Subject<boolean>();
        this._isMatchCompleted$.next(false);
        this.waitingPlayers = [];
        this.cloudData.getWaitingPlayers$().subscribe(
            waitingPlayers => {
                this.waitingPlayers = waitingPlayers || [];
            },
            error => {
                console.log(error);
            }
        );
    }

    get isMatchCompleted$(): Observable<boolean> {
        return this._isMatchCompleted$.asObservable();
    }

    get items(): MatchItem[] {
        return this._items;
    }

    challenge(item: MatchItem, challenge: boolean) {
        const opponentUid = item.opponentUid;
        if (challenge) {
            this.cloudFunctions.addChallenge({ opponentUid });
        } else {
            this.cloudFunctions.removeChallenge({ opponentUid });
        }
    }

    private set waitingPlayers(waitingPlayers: WaitingPlayer[]) {
        const myWaitingPlayers = waitingPlayers.filter(
            waitingPlayer => {
                return waitingPlayer.uid === this._uid;
            }
        );
        const myWaitingPlayer = myWaitingPlayers[0];

        const otherWaitingPlayers = waitingPlayers.filter(
            waitingPlayer => {
                return waitingPlayer.uid !== this._uid;
            }
        );

        this._items = otherWaitingPlayers.map(otherWaitingPlayer => {
            let myChallenge: Challenge;
            if (myWaitingPlayer && myWaitingPlayer.challenges) {
                myChallenge = myWaitingPlayer.challenges.find(
                    x => x.challengerInfo.uid === otherWaitingPlayer.uid
                );
            }
            const isOpponentChallenging = myChallenge ? true : false;

            let otherChallenge: Challenge;
            if (otherWaitingPlayer.challenges) {
                otherChallenge = otherWaitingPlayer.challenges.find(
                    x => x.challengerInfo.uid === this._uid
                );
            }
            const isOpponentChallenged = otherChallenge ? true : false;

            const item = new MatchItem(
                otherWaitingPlayer.uid,
                otherWaitingPlayer.playerInfo.displayName,
                isOpponentChallenged,
                isOpponentChallenging
            );
            return item;
        });

        if (myWaitingPlayer) {
            if (this._state === MatchState.Idle) {
                this._state = MatchState.Started;
            }
        } else {
            if (this._state === MatchState.Started) {
                this._state = MatchState.Completed;
            }
        }
        this._isMatchCompleted$.next(this._state === MatchState.Completed);
    }
}
