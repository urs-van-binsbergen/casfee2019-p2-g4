import COLL from '../../public/collection-names';
import { UpdateUserArgs } from '../../public/arguments';
import { User, PlayerLevel } from '../../public/core-models';
import { createPlayerInfo } from '../../public/player-info';

export function setUser(
    db: FirebaseFirestore.Firestore,
    uid: string,
    args: UpdateUserArgs,
    allowUpdate: boolean
) {
    return db.runTransaction(async tx => {
        const userRef = db.collection(COLL.USERS).doc(uid);
        const userDoc = await tx.get(userRef);
        const hallRef = db.collection(COLL.HALL_ENTRIES).doc(uid);
        const hallDoc = await tx.get(hallRef);

        // --- Do only WRITE after this point! ------------------------

        if (!userDoc.exists) {
            const user: User = {
                uid,
                email: args.email,
                displayName: args.displayName,
                avatarFileName: args.avatarFileName,
                level: PlayerLevel.Shipboy
            };
            tx.create(userRef, user);
        } else if (allowUpdate) {
            tx.update(userRef, {
                displayName: args.displayName,
                avatarFileName: args.avatarFileName,
                email: args.email
            });
            if(hallDoc.exists) {
                const oldPlayerInfo = createPlayerInfo(userDoc.data() as User);
                tx.update(hallRef, {
                    playerInfo: {
                        ...oldPlayerInfo,
                        displayName: args.displayName,
                        avatarFileName: args.avatarFileName,
                        email: args.email
                    }
                });    
            }
        }

    });
}
