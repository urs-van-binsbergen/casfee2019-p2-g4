import { HallEntry } from '@cloud-api/core-models';

export class UpdateHall {
    static readonly type = '[hall] update';
    constructor(public entries: HallEntry[]) { }
}

export class BindHall {
    static readonly type = '[hall] bind';
    constructor() { }
}

export class UnbindHall {
    static readonly type = '[hall] unbind';
    constructor() { }
}
