import { HttpsError } from 'firebase-functions/lib/providers/https';
import { auth } from 'firebase-admin';

export interface AuthInfo {
    uid: string;
    displayName: string;
}

export function authenticate(
    contextAuth: { uid: string, token: auth.DecodedIdToken } | undefined
): AuthInfo {
    if (!contextAuth) {
        throw new HttpsError('permission-denied', 'no auth in context');
    }
    const uid = contextAuth.uid;
    const displayName = contextAuth.token.name;

    return { uid, displayName };
}
