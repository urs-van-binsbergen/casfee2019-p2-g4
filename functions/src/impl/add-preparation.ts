import { } from 'firebase-admin'
import * as functions from 'firebase-functions';

export default function addPreparation(
    req: functions.https.Request,
    res: functions.Response,
    db: FirebaseFirestore.Firestore
) {
    // TODO
    console.log("addPreparation()")
    const doc = {
        userId: "todo",
        ships: [{ x: 4, y: 2, length: 3, isVertical: false }]
    };
    db.collection("preparations").add(doc)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            res.status(200).send(docRef);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
            res.status(500).send(error);
        });
    return "ok";
}
