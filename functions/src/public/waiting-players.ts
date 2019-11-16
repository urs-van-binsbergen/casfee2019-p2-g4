import { getData } from '../shared/db-utils';
import { WaitingPlayer } from '../public/core-models';
import COLL from '../public/firestore-collection-name-const';
import { DocumentReference } from '@google-cloud/firestore';

interface WaitingPlayersData {
    wPlayer: WaitingPlayer | null;
    oppWPlayer: WaitingPlayer | null;
    challengeMap: ChallengeMapEntry[];
}

interface ChallengeMapEntry {
    challengeTargetRef: DocumentReference;
    challengerUid: string;
    challengeTarget: WaitingPlayer;
}


export async function getWaitingPlayersData(
    db: FirebaseFirestore.Firestore,
    tx: FirebaseFirestore.Transaction,
    uid: string, oppUid: string | null
): Promise<WaitingPlayersData> {
    const wPlayerCollRef = db.collection(COLL.WAITING_PLAYERS);

    const data: WaitingPlayersData = {
        wPlayer: null,
        oppWPlayer: null,
        challengeMap: []
    };

    await tx.get(wPlayerCollRef).then(snapshot => {
        snapshot.forEach(doc => {
            const wPlayer = getData<WaitingPlayer>(doc);
            if (wPlayer.uid === uid) {
                data.wPlayer = wPlayer;
            } else if (oppUid && wPlayer.uid === oppUid) {
                data.oppWPlayer = wPlayer;
            }
            for (const challenge of wPlayer.challenges) {
                data.challengeMap.push({
                    challengeTargetRef: doc.ref,
                    challengeTarget: wPlayer,
                    challengerUid: challenge.challengerInfo.uid
                });
            }
        });
    });

    return data;
}

export function removePassiveChallenges(
    challengeMap: ChallengeMapEntry[],
    tx: FirebaseFirestore.Transaction,
    challengerUids: string[]
) {
    const challengeTargets: { ref: DocumentReference, challengeTarget: WaitingPlayer }[] = [];
    for (const m of challengeMap.filter(x => challengerUids.includes(x.challengerUid))) {
        challengeTargets.push({
            ref: m.challengeTargetRef,
            challengeTarget: m.challengeTarget
        });
    }

    for (const t of challengeTargets) {
        // Do not alter challenger's entry (will typically be deleted anyway)
        if (challengerUids.includes(t.challengeTarget.uid)) {
            continue;
        }
        tx.update(t.ref, {
            challenges: t.challengeTarget.challenges.filter(
                x => !challengerUids.includes(x.challengerInfo.uid)
            )
        });
    }
}
