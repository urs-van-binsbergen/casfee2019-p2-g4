import { AuthUser } from '../auth.service';

export class ObserveAuthUser {
    static readonly type = '[auth] observe auth user';
    constructor() { }
}

export class AuthUserChanged {
    static readonly type = '[auth] auth user changed';
    constructor(public authUser: AuthUser) { }
}

export class Login {
    static readonly type = '[auth] login';
    constructor(public username: string, public password: string) { }
}

export class Register {
    static readonly type = '[auth] register';
    constructor(public email: string, public password: string, public displayName: string) {}
}
