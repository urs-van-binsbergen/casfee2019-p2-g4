import { firestore } from 'firebase-admin'

export default function helloFirestore (
    snap: firestore.DocumentSnapshot,
    db: FirebaseFirestore.Firestore
) {
    var data = snap.data();
    if (!data) {
        return;
    }

    const name: string = data.name;

    db.collection("items2").doc("LA").set({
        name: name,
        test: "CA"
    })
}
