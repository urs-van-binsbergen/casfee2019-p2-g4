import { WaitingPlayer } from '@cloud-api/core-models';

export class AddChallenge {
    static readonly type = '[match] add challenge';
    constructor(public opponentUid: string) { }
}

export class RemoveChallenge {
    static readonly type = '[match] remove challenge';
    constructor(public opponentUid: string) { }
}

export class UpdateWaitingPlayers {
    static readonly type = '[match] update waiting players';
    constructor(public waitingPlayers: WaitingPlayer[]) { }
}

export class CancelMatch {
    static readonly type = '[match] cancel';
    constructor() { }
}

export class BindMatch {
    static readonly type = '[match] bind';
    constructor() { }
}

export class BindingMatch {
    static readonly type = '[match] binding';
    constructor() { }
}

export class UnbindMatch {
    static readonly type = '[match] unbind';
    constructor() { }
}
