import * as MatchMethods from './match-methods';
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

describe('getMatchItems', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('with undefined uid', () => {
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.toMatchItems(action, undefined);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with uid set to null', () => {
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.toMatchItems(action, null);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with undefined action', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.toMatchItems(undefined, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with action set to null', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.toMatchItems(null, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with action set to null', () => {
        const uid = 'cinque';
        const matchItems = MatchMethods.toMatchItems(null, uid);
        expect(str(matchItems)).toBe(str([]));
    });

    it('with with non-matching action', () => {
        const uid = 'cinque';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.toMatchItems(action, uid);
        expect(str(matchItems)).toBe(str([]));
        expect(str(action)).toBe(actionBefore);
    });

    it('with with matching action (uno)', () => {
        const uid = 'uno';
        const action = waitingPlayers;
        const actionBefore = str(action);
        const matchItems = MatchMethods.toMatchItems(action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'due',
                opponentName: 'Due',
                isOpponentChallenged: true,
                isOpponentChallenging: false
            },
            {
                opponentUid: 'tre',
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
        const matchItems = MatchMethods.toMatchItems(action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'uno',
                opponentName: 'Uno',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            },
            {
                opponentUid: 'tre',
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
        const matchItems = MatchMethods.toMatchItems(action, uid);
        expect(str(matchItems)).toBe(str([
            {
                opponentUid: 'uno',
                opponentName: 'Uno',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            },
            {
                opponentUid: 'due',
                opponentName: 'Due',
                isOpponentChallenged: false,
                isOpponentChallenging: true
            }
        ]));
        expect(str(action)).toBe(actionBefore);
    });

});
