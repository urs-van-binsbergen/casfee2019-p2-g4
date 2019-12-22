import { Player } from '@cloud-api/core-models';

export class ObservePlayer {
    static readonly type = '[game] observe player';
    constructor(public uid: string) { }
}

export class ObserveUser {
    static readonly type = '[game] observe user';
    constructor() { }
}

export class UpdatePlayer {
    static readonly type = '[game] update player';
    constructor(public player: Player) { }
}
