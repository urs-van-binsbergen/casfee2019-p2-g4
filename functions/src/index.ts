import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin'
admin.initializeApp();
const db = admin.firestore();

const firestoreEurope2 = functions.region('europe-west2').firestore;

export const helloFirestoreFunction = firestoreEurope2
    .document(`items/{itemId}`)
    .onCreate(async (snap, context) => {
        var data = snap.data(); 
        if(!data) {
            return;
        }
        const name: string = data.name;

        db.collection("items2").doc("LA").set({
            name: name,
            test: "CA"
        })
    });