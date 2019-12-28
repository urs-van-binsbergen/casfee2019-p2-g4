import { AuthUser } from '../auth.service';

export class ObserveAuthUser {
    static readonly type = '[auth] observe auth user';
    constructor() { }
}

export class AuthUserChanged {
    static readonly type = '[auth] auth user changed';
    constructor(public authUser: AuthUser) { }
}
