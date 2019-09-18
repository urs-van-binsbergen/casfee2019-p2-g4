// Use cloud functions with predefined region
import * as functions from 'firebase-functions';
const eu2 = functions.region('europe-west2');

// short vars for cloud hooks
const firestore = eu2.firestore; // for db triggers
const https = eu2.https; // for http methods and callables
const auth = eu2.auth; // for auth triggers

// Admin SDK (required to actually do something like changing data)
import * as admin from 'firebase-admin'
admin.initializeApp();
const db = admin.firestore();

// API ----------------------------------------

import helloFirestoreImpl from './impl/hello-firestore';
export const helloFirestore = firestore.document(`items/{itemId}`).onCreate(
    (snap) => helloFirestoreImpl(snap, db));

import addUserImpl from './impl/add-user';
export const addUser = auth.user().onCreate(
    (user) => addUserImpl(user, db));

import addPreparationImpl from './impl/add-preparation';
export const addPreparation = https.onCall(
    (data, context) => addPreparationImpl(data, context, db));

import addChallengeImpl from './impl/add-challenge';
export const addChallenge = https.onCall(
    (data, context) => addChallengeImpl(data, context, db));

import makeGuessImpl from './impl/make-guess';
export const makeGuess = https.onCall(
    (data, context) => makeGuessImpl(data, context, db));

import purgeMiniGameImpl from './impl/purge-mini-game';
export const purgeMiniGame = https.onCall(
    (data, context) => purgeMiniGameImpl(data, context, db));