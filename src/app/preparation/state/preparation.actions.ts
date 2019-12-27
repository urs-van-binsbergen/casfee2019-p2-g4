import { PreparationShip } from '../model/preparation-models';

export class AddPreparation {
    static readonly type = '[preparation] add';
    constructor(public ships: PreparationShip[]) { }
}
