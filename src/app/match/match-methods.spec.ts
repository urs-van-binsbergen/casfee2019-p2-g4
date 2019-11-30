import * as MatchMethods from './match-methods';
import { MatchState } from './match-models';
import { PlayerLevel, WaitingPlayer } from '@cloud-api/core-models';

function str(v: any): string {
    return JSON.stringify(v);
}

const waitingPlayers: WaitingPlayer[] = [
    {
        uid: 'uno',
        playerInfo: {
            uid: 'uno',
            displayName: 'Uno',
            avatarFileName: null,
            level: PlayerLevel.Seaman
        },
        challenges: []
    },
    {
        uid: 'due',
        playerInfo: {
            uid: 'due',
            displayName: 'Due',
            avatarFileName: null,
            level: PlayerLevel.Seaman
        },
        challenges: [
            {
                challengerInfo: {
                    uid: 'uno',
                    displayName: 'Uno',
                    avatarFileName: null,
                    level: PlayerLevel.Seaman
                },
                challengeDate: null
            }
        ]
    },
    {
        uid: 'tre',
        playerInfo: {
            uid: 'tre',
            displayName: 'Tre',
            avatarFileName: null,
            level: PlayerLevel.Seaman
        },
        challenges: [
            {
                challengerInfo: {
                    uid: 'uno',
                    displayName: 'Uno',
                    avatarFileName: null,
                    level: PlayerLevel.Seaman
                },
                challengeDate: null
            },
            {
                challengerInfo: {
                    uid: 'due',
                    displayName: 'Due',
                    avatarFileName: null,
                    level: PlayerLevel.Seaman
                },
                challengeDate: null
            }
        ]
    }
];

describe('MatchMethods reduce MatchState', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('with undefined uid (* --> Idle)', () => {
        const state = MatchState.Started;
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, undefined);
        expect(matchState).toBe(MatchState.Idle);
        expect(str(action)).toBe(actionBefore);
    });

    it('with uid set to null (* --> Idle)', () => {
        const state = MatchState.Started;
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, null);
        expect(matchState).toBe(MatchState.Idle);
        expect(str(action)).toBe(actionBefore);
    });

    it('with undefined action (* --> Idle)', () => {
        const state = MatchState.Started;
        const uid = 'cinque';
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, undefined, uid);
        expect(matchState).toBe(MatchState.Idle);
    });

    it('with action set to null (* --> Idle)', () => {
        const state = MatchState.Started;
        const uid = 'cinque';
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, null, uid);
        expect(matchState).toBe(MatchState.Idle);
    });

    it('with non-matching action (Idle --> Idle)', () => {
        const state = MatchState.Idle;
        const uid = 'cinque';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Idle);
        expect(str(action)).toBe(actionBefore);
    });

    it('with non-matching action (Started --> Completed)', () => {
        const state = MatchState.Started;
        const uid = 'cinque';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Completed);
        expect(str(action)).toBe(actionBefore);
    });

    it('with non-matching action (Completed --> Completed)', () => {
        const state = MatchState.Completed;
        const uid = 'cinque';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Completed);
        expect(str(action)).toBe(actionBefore);
    });

    it('with matching action (Idle --> Started)', () => {
        const state = MatchState.Idle;
        const uid = 'uno';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Started);
        expect(str(action)).toBe(actionBefore);
    });

    it('with matching action (Started --> Started)', () => {
        const state = MatchState.Started;
        const uid = 'uno';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Started);
        expect(str(action)).toBe(actionBefore);
    });

    it('with matching action (Started --> Completed)', () => {
        const state = MatchState.Started;
        const uid = 'uno';
        const action: WaitingPlayer[] = waitingPlayers.filter((waitingPlayer: WaitingPlayer) => {
            return waitingPlayer.uid !== uid;
        });
        const actionBefore = str(action);
        const matchState = MatchMethods.reduceMatchStateWithWaitingPlayers(state, action, uid);
        expect(matchState).toBe(MatchState.Completed);
        expect(str(action)).toBe(actionBefore);
    });

});

describe('MatchMethods reduce MatchItems', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('with undefined uid', () => {
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, undefined);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with uid set to null', () => {
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, null);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with undefined action', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, undefined, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with action set to null', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, null, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with action set to null', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, null, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with with non-matching action', () => {
        const uid = 'cinque';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, uid);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with with matching action (uno)', () => {
        const uid = 'uno';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'due',
                victories: 12,
                defeats: 23,
                opponentName: 'Due',
                isOpponentChallenged: true,
                isOpponentChallenging: false
            },
            {
                opponentUid: 'tre',
                victories: 12,
                defeats: 23,
                opponentName: 'Tre',
                isOpponentChallenged: true,
                isOpponentChallenging: false
            }
        ]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with with matching action (due)', () => {
        const uid = 'due';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'uno',
                victories: 12,
                defeats: 23,
                opponentName: 'Uno',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            },
            {
                opponentUid: 'tre',
                victories: 12,
                defeats: 23,
                opponentName: 'Tre',
                isOpponentChallenged: true,
                isOpponentChallenging: false
            }
        ]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with with matching action (tre)', () => {
        const uid = 'tre';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.reduceMatchItemsWithWaitingPlayers(null, action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'uno',
                victories: 12,
                defeats: 23,
                opponentName: 'Uno',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            },
            {
                opponentUid: 'due',
                victories: 12,
                defeats: 23,
                opponentName: 'Due',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            }
        ]));
        expect(str(action)).toBe(actionBefore);
    });

});
