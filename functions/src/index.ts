// Use cloud functions with predefined region
import * as functions from 'firebase-functions';
const eu2 = functions.region('europe-west2');

// short vars for cloud hooks
const https = eu2.https; // for http methods and callables
const auth = eu2.auth; // for auth triggers

// Admin SDK (required to actually do something like changing data)
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// API ----------------------------------------

import onAuthUserCreateImpl from './impl/on-auth-user-create';
export const onAuthUserCreate = auth.user().onCreate(
    (user) => onAuthUserCreateImpl(user, db));

import updateUserImpl from './impl/update-user';
export const updateUser = https.onCall(
    (data, context) => updateUserImpl(data, context, db));

import addPreparationImpl from './impl/add-preparation';
export const addPreparation = https.onCall(
    (data, context) => addPreparationImpl(data, context, db));

import removePreparationImpl from './impl/remove-preparation';
export const removePreparation = https.onCall(
    (data, context) => removePreparationImpl(data, context, db));

import addChallengeImpl from './impl/add-challenge';
export const addChallenge = https.onCall(
    (data, context) => addChallengeImpl(data, context, db));

import removeChallengeImpl from './impl/remove-challenge';
export const removeChallenge = https.onCall(
    (data, context) => removeChallengeImpl(data, context, db));

import shootImpl from './impl/shoot';
export const shoot = https.onCall(
    (data, context) => shootImpl(data, context, db));

import purgeMiniGameImpl from './impl/purge-mini-game';
export const purgeMiniGame = https.onCall(
    (data, context) => purgeMiniGameImpl(data, context, db));
