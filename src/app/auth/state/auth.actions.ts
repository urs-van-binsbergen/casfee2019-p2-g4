import { AuthUser } from '../auth.service';
import { User } from '@cloud-api/core-models';

export class ObserveAuthUser {
    static readonly type = '[auth] observe auth user';
    constructor() { }
}

export class AuthUserChanged {
    static readonly type = '[auth] auth user changed';
    constructor(public authUser: AuthUser) { }
}

export class Unauthenticated {
    static readonly type = '[auth] unauthenticated';
    constructor() { }
}

export class ObserveUser {
    static readonly type = '[auth] observe user';
    constructor(public uid: string) { }
}

export class UserUpdated {
    static readonly type = '[auth] user updated';
    constructor(public user: User) { }
}

export class Login {
    static readonly type = '[auth] login';
    constructor(public username: string, public password: string) { }
}

export class Logout {
    static readonly type = '[auth] logout';
    constructor() { }
}

export class Register {
    static readonly type = '[auth] register';
    constructor(public email: string, public password: string, public displayName: string) { }
}

export class UpdateProfile {
    static readonly type = '[auth] update profile';
    constructor(public displayName: string, public email: string) { }
}

export class UpdatePassword {
    static readonly type = '[auth] update password';
    constructor(public oldPassword: string, public newPassword: string) { }
}

export class SendPasswordMail {
    static readonly type = '[auth] send password mail';
    constructor(public email: string) { }
}
