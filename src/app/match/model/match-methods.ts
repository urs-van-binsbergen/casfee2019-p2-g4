import { MatchItem } from './match-models';
import { Challenge, WaitingPlayer } from '@cloud-api/core-models';

export function toMatchItems(waitingPlayers: WaitingPlayer[], uid: string): MatchItem[] {
    if (waitingPlayers && uid) {
        const myWaitingPlayers = waitingPlayers.filter(
            waitingPlayer => {
                return waitingPlayer.uid === uid;
            }
        );
        const myWaitingPlayer = myWaitingPlayers[0];
        if (myWaitingPlayer) {
            const otherWaitingPlayers = waitingPlayers.filter(
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
