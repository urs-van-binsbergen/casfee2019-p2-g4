import { auth } from 'firebase-admin';

export default function addUser(
    user: auth.UserRecord,
    db: FirebaseFirestore.Firestore
) {
    const uid = user.uid;

    const doc = {
        numberOfVictories: 0,
        level: 0
    };
    return db.collection('users').doc(uid).set(doc)
        .then((docRef) => {
            console.log('Document written');
        })
        .catch((error) => {
            console.error('Error adding document: ', error);
        });
}
