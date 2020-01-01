import { MatchItem, MatchStatus } from './match-models';
import { Challenge, WaitingPlayer } from '@cloud-api/core-models';

export function updateMatchItemsWithWaitingPlayers(state: MatchItem[], action: WaitingPlayer[], uid: string): MatchItem[] {
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

export function updateMatchStatusWithWaitingPlayers(state: MatchStatus, action: WaitingPlayer[], uid: string): MatchStatus {
    if (action && uid) {
        const myWaitingPlayers = action.filter(
            waitingPlayer => {
                return waitingPlayer.uid === uid;
            }
        );
        const myWaitingPlayer = myWaitingPlayers[0];
        let matchState = state;
        if (myWaitingPlayer) {
            if (state === MatchStatus.Idle) {
                matchState = MatchStatus.Started;
            }
        } else {
            if (state === MatchStatus.Started) {
                matchState = MatchStatus.Completed;
            }
        }
        return matchState;
    }
    return MatchStatus.Idle;
}
