import { auth } from 'firebase-admin'

export default function addUser(
    user: auth.UserRecord,
    db: FirebaseFirestore.Firestore
) {
    // TODO
    console.log("addUser()")
    const doc = {
        uid: user.uid,
        numberOfVictories: 0,
        level: 0
    };
    db.collection("users").add(doc)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
    return "ok";
}
