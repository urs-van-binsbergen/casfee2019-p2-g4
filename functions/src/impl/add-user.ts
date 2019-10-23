import { auth } from 'firebase-admin';
import COLL from '../public/firestore-collection-name-const';
import { User, PlayerLevel } from '../public/core-models';

export default function addUser(
    userRecord: auth.UserRecord,
    db: FirebaseFirestore.Firestore
) {
    const user: User = {
        uid: userRecord.uid,
        email: userRecord.email || null,
        displayName: userRecord.displayName || null,
        avatarFileName: null,
        level: PlayerLevel.Shipboy,
        numberOfVictories: 0
    };
    return db.collection(COLL.USERS).doc(user.uid).set(user)
        .then((docRef) => {
            console.log('Document written');
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
}
