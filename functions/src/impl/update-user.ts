import { CallableContext, HttpsError } from 'firebase-functions/lib/providers/https';

import { authenticate } from '../shared/auth-utils';

import { UpdateUserArgs } from '../public/arguments';
import { setUser } from '../shared/db/user';

export default async function foo(
    data: any,
    context: CallableContext,
    db: FirebaseFirestore.Firestore,
) {
    const authInfo = authenticate(context.auth);
    const uid = authInfo.uid;
    const args = toUpdateUserArgs(data);

    return setUser(db, uid, args, true);
}

function toUpdateUserArgs(data: any): UpdateUserArgs {
    if (!data) {
        throw new HttpsError('invalid-argument', 'data missing');
    }

    const displayName = `${data.displayName}` || null;
    const avatarFileName = `${data.avatarFileName}` || null;
    const email = `${data.email}` || null;

    return { displayName, avatarFileName, email };
}
