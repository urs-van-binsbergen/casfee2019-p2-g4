import { Ship } from '@cloud-api/core-models';

export class AddPreparation {
    static readonly type = '[preparation] add';
    constructor(public ships: Ship[], public width: number, public height: number) { }
}
