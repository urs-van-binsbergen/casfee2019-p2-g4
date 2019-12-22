import { Player } from '@cloud-api/core-models';

export class ObservePlayer {
    static readonly type = '[game] observe player';
    constructor(public uid: string) { }
}

export class ObserveUser {
    static readonly type = '[game] observe user';
    constructor() { }
}

export class PlayerUpdated {
    static readonly type = '[game] player updated';
    constructor(public player: Player) { }
}

