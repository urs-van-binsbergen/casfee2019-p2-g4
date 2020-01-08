import { WaitingPlayer } from '@cloud-api/core-models';

export class AddChallenge {
    static readonly type = '[match] add challenge';
    constructor(public opponentUid: string, public isStartingBattle: boolean) { }
}

export class RemoveChallenge {
    static readonly type = '[match] remove challenge';
    constructor(public opponentUid: string) { }
}

export class CancelMatch {
    static readonly type = '[match] cancel';
    constructor() { }
}

export class UpdateMatch {
    static readonly type = '[match] update';
    constructor(public waitingPlayers: WaitingPlayer[]) { }
}

export class BindMatch {
    static readonly type = '[match] bind';
    constructor() { }
}

export class UnbindMatch {
    static readonly type = '[match] unbind';
    constructor() { }
}
