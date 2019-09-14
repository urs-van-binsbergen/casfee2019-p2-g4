import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin'
admin.initializeApp();
const db = admin.firestore();

import helloFirestore from './samples/hello-firestore';

const eu2 = functions.region('europe-west2');

export const helloFirestoreFunction = eu2.firestore
    .document(`items/{itemId}`)
    .onCreate(async (snap) => helloFirestore(snap, db));