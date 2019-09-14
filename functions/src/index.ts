// Cloud functions with predefined region
import * as functions from 'firebase-functions';
const eu2 = functions.region('europe-west2');
const firestore = eu2.firestore;
const https = eu2.https;
const auth = eu2.auth;

// Admin SDK
import * as admin from 'firebase-admin'
admin.initializeApp();
const db = admin.firestore();

// Implementations ----------------------------------------

import helloFirestoreImpl from './impl/hello-firestore';
export const helloFirestore = firestore.document(`items/{itemId}`)
    .onCreate((snap) => helloFirestoreImpl(snap, db));

import addUserImpl from './impl/add-user';
export const addUser = auth.user().onCreate((user) => addUserImpl(user, db));

import addPreparationImpl from './impl/add-preparation';
export const addPreparation = https.onRequest((req, resp) => addPreparationImpl(req, resp, db));