import { MatchItem, MatchState } from './match-models';
import { Challenge, WaitingPlayer } from '@cloud-api/core-models';

export function reduceMatchItemsWithWaitingPlayers(state: MatchItem[], action: WaitingPlayer[], uid: string): MatchItem[] {
    if (action && uid) {
        const myWaitingPlayers = action.filter(
            waitingPlayer => {
                return waitingPlayer.uid === uid;
            }
        );
        const myWaitingPlayer = myWaitingPlayers[0];
        if (myWaitingPlayer) {
            const otherWaitingPlayers = action.filter(
                waitingPlayer => {
                    return waitingPlayer.uid !== uid;
                }
            );
            const items = otherWaitingPlayers.map(otherWaitingPlayer => {
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
                        x => x.challengerInfo.uid === uid
                    );
                }
                const isOpponentChallenged = otherChallenge ? true : false;
                const item = {
                    opponentUid: otherWaitingPlayer.uid,
                    victories: 12,
                    defeats: 23,
                    opponentName: otherWaitingPlayer.playerInfo.displayName,
                    isOpponentChallenged,
                    isOpponentChallenging
                };
                return item;
            });
            return items;
        }
    }
    return [];
}

export function reduceMatchStateWithWaitingPlayers(state: MatchState, action: WaitingPlayer[], uid: string): MatchState {
    if (action && uid) {
        const myWaitingPlayers = action.filter(
            waitingPlayer => {
                return waitingPlayer.uid === uid;
            }
        );
        const myWaitingPlayer = myWaitingPlayers[0];
        let matchState = state;
        if (myWaitingPlayer) {
            if (state === MatchState.Idle) {
                matchState = MatchState.Started;
            }
        } else {
            if (state === MatchState.Started) {
                matchState = MatchState.Completed;
            }
        }
        return matchState;
    }
    return MatchState.Idle;
}
