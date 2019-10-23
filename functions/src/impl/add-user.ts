import { auth } from 'firebase-admin';
import COLL from '@cloud-api/firestore-collection-name-const';

export default function addUser(
    user: auth.UserRecord,
    db: FirebaseFirestore.Firestore
) {
    const uid = user.uid;

    const doc = {
        numberOfVictories: 0,
        level: 0
    };
    return db.collection(COLL.USERS).doc(uid).set(doc)
        .then((docRef) => {
            console.log('Document written');
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
}
