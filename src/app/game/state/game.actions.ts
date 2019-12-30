import { Pos } from '@cloud-api/geometry';
import { Player } from '@cloud-api/core-models';

export class Shoot {
    static readonly type = '[game] shoot';
    constructor(public pos: Pos) { }
}

export class Capitulate {
    static readonly type = '[game] capitulate';
    constructor() { }
}

export class Delete {
    static readonly type = '[game] delete';
    constructor() { }
}

export class UpdateGame {
    static readonly type = '[game] update';
    constructor(public player: Player, public unauthenticated: boolean) { }
}

export class BindGame {
    static readonly type = '[game] bind';
    constructor() { }
}

export class UnbindGame {
    static readonly type = '[game] unbind';
    constructor() { }
}
