import COLL from '../public/firestore-collection-name-const';
import { UpdateUserArgs } from '../public/arguments';
import { User, PlayerLevel } from '../public/core-models';

export function setUser(
    db: FirebaseFirestore.Firestore,
    uid: string,
    args: UpdateUserArgs,
    allowUpdate: boolean
) {
    return db.runTransaction(async tx => {
        const userRef = db.collection(COLL.USERS).doc(uid);
        const userDoc = await tx.get(userRef);

        // --- Do only WRITE after this point! ------------------------

        if (!userDoc.exists) {
            const user: User = {
                uid,
                email: args.email,
                displayName: args.displayName,
                avatarFileName: args.avatarFileName,
                level: PlayerLevel.Shipboy,
                numberOfVictories: 0
            };
            tx.create(userRef, user);
        } else if (allowUpdate) {
            tx.update(userRef, {
                displayName: args.displayName,
                avatarFileName: args.avatarFileName,
                email: args.email
            });
        }

    });
}
