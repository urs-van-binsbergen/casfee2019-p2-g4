import { Player } from '@cloud-api/core-models';

export class ObservePlayer {
    static readonly type = '[game] observe player';
    constructor(public uid: string) { }
}

export class PlayerUpdated {
    static readonly type = '[game] player updated';
    constructor(public player: Player) { }
}

export class ObserveAuthUser {
    static readonly type = '[game] observe auth user';
    constructor() { }
}

export class Unauthenticated {
    static readonly type = '[game] unauthenticated';
    constructor() { }
}


