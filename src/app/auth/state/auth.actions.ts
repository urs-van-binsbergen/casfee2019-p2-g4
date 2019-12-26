import { AuthUser } from '../auth.service';

export class ObserveUser {
    static readonly type = '[auth] observe user';
    constructor() { }
}

export class UpdateUser {
    static readonly type = '[auth] update user';
    constructor(public authUser: AuthUser) { }
}
