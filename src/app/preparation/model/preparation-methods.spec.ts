import { PreparationDrop, PreparationShip } from './preparation-models';
import * as PreparationMethods from './preparation-methods';

function str(v: any): string {
    return JSON.stringify(v);
}

describe('PreparationMethods reducePreparationWithDrop', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('reduce null with null', () => {
        const state: PreparationShip[] = null;
        const action: PreparationDrop = null;
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce [] with null', () => {
        const state: PreparationShip[] = [];
        const action: PreparationDrop = null;
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce [] with drop', () => {
        const state: PreparationShip[] = [];
        const action: PreparationDrop = { key: 0, pos: { x: 0, y: 0 } };
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce state with null', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = null;
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str(state));
    });

    it('reduce state with drop (not existing key)', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = { key: 0, pos: { x: 3, y: 3 } };
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str(state));
    });

    it('reduce [] with drop (not existing key)', () => {
        const state: PreparationShip[] = [];
        const action: PreparationDrop = { key: 10, pos: { x: 3, y: 3 } };
        const yard: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce state with drop (existing key state)', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = { key: 20, pos: { x: 3, y: 3 } };
        const yard: PreparationShip[] = null;
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        const ref: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 3, y: 3 },
                center: { x: 3, y: 3 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 3, y: 3 }, { x: 3, y: 4 }],
                isOk: true,
                isVertical: true
            }
        ];
        expect(str(preparation)).toBe(str(ref));
    });

    it('reduce state with drop (existing key yard)', () => {
        const state: PreparationShip[] = [];
        const action: PreparationDrop = { key: 20, pos: { x: 3, y: 3 } };
        const yard: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const preparation = PreparationMethods.updatePreparationWithDrop(state, action, yard);
        const ref: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 3, y: 3 },
                center: { x: 3, y: 3 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 3, y: 3 }, { x: 3, y: 4 }],
                isOk: true,
                isVertical: true
            }
        ];
        expect(str(preparation)).toBe(str(ref));
    });

});

describe('PreparationMethods reducePreparationWithRotation', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('reduce null with null', () => {
        const state: PreparationShip[] = null;
        const action: number = null;
        const preparation = PreparationMethods.updatePreparationWithRotation(state, action);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce [] with null', () => {
        const state: PreparationShip[] = [];
        const action: number = null;
        const preparation = PreparationMethods.updatePreparationWithRotation(state, action);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce [] with key', () => {
        const state: PreparationShip[] = [];
        const action = 13;
        const preparation = PreparationMethods.updatePreparationWithRotation(state, action);
        expect(str(preparation)).toBe(str([]));
    });

    it('reduce state with missing key', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action = 13;
        const preparation = PreparationMethods.updatePreparationWithRotation(state, action);
        expect(str(preparation)).toBe(str(state));
    });

    it('reduce state with existing key', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action = 20;
        const preparation = PreparationMethods.updatePreparationWithRotation(state, action);
        const ref: PreparationShip[] = [
            {
                key: 20,
                pos: { x: -1, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 50,
                centerHorizontal: 75,
                length: 2,
                rotation: 90,
                positions: [{ x: -1, y: 0 }, { x: 0, y: 0 }],
                isOk: false,
                isVertical: false
            }
        ];
        expect(str(preparation)).toBe(str(ref));
    });

    it('rotate ship lenght 2 (0 --> 90 --> 180 --> 270 --> 360)', () => {
        const preparation0: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 7, y: 1 },
                center: { x: 7, y: 1 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 7, y: 1 }, { x: 7, y: 2 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action = 20;
        const preparation90 = PreparationMethods.updatePreparationWithRotation(preparation0, action);
        expect(str(preparation90)).toBe(str([
            {
                key: 20,
                pos: { x: 6, y: 1 },
                center: { x: 7, y: 1 },
                centerVertical: 50,
                centerHorizontal: 75,
                length: 2,
                rotation: 90,
                positions: [{ x: 6, y: 1 }, { x: 7, y: 1 }],
                isOk: true,
                isVertical: false
            }
        ]));
        const preparation180 = PreparationMethods.updatePreparationWithRotation(preparation90, action);
        expect(str(preparation180)).toBe(str([
            {
                key: 20,
                pos: { x: 7, y: 0 },
                center: { x: 7, y: 1 },
                centerVertical: 75,
                centerHorizontal: 50,
                length: 2,
                rotation: 180,
                positions: [{ x: 7, y: 0 }, { x: 7, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ]));
        const preparation270 = PreparationMethods.updatePreparationWithRotation(preparation180, action);
        expect(str(preparation270)).toBe(str([
            {
                key: 20,
                pos: { x: 7, y: 1 },
                center: { x: 7, y: 1 },
                centerVertical: 50,
                centerHorizontal: 25,
                length: 2,
                rotation: 270,
                positions: [{ x: 7, y: 1 }, { x: 8, y: 1 }],
                isOk: false,
                isVertical: false
            }
        ]));
        const preparation360 = PreparationMethods.updatePreparationWithRotation(preparation270, action);
        expect(str(preparation360)).toBe(str(preparation0));
    });

    it('rotate ship lenght 3 (0 --> 90 --> 180 --> 270 --> 360)', () => {
        const preparation0: PreparationShip[] = [
            {
                key: 30,
                pos: { x: 6, y: 6 },
                center: { x: 6, y: 7 },
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 0,
                positions: [{ x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }],
                isOk: false,
                isVertical: true
            }
        ];
        const action = 30;
        const preparation90 = PreparationMethods.updatePreparationWithRotation(preparation0, action);
        expect(str(preparation90)).toBe(str([
            {
                key: 30,
                pos: { x: 5, y: 7 },
                center: { x: 6, y: 7 },
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 90,
                positions: [{ x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }],
                isOk: true,
                isVertical: false
            }
        ]));
        const preparation180 = PreparationMethods.updatePreparationWithRotation(preparation90, action);
        expect(str(preparation180)).toBe(str([
            {
                key: 30,
                pos: { x: 6, y: 6 },
                center: { x: 6, y: 7 },
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 180,
                positions: [{ x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }],
                isOk: false,
                isVertical: true
            }
        ]));
        const preparation270 = PreparationMethods.updatePreparationWithRotation(preparation180, action);
        expect(str(preparation270)).toBe(str([
            {
                key: 30,
                pos: { x: 5, y: 7 },
                center: { x: 6, y: 7 },
                centerVertical: 50,
                centerHorizontal: 50,
                length: 3,
                rotation: 270,
                positions: [{ x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }],
                isOk: true,
                isVertical: false
            }
        ]));
        const preparation360 = PreparationMethods.updatePreparationWithRotation(preparation270, action);
        expect(str(preparation360)).toBe(str(preparation0));
    });

    it('rotate ship lenght 4 (0 --> 90 --> 180 --> 270 --> 360)', () => {
        const preparation0: PreparationShip[] = [
            {
                key: 40,
                pos: { x: 1, y: 5 },
                center: { x: 1, y: 6 },
                centerVertical: 37.5,
                centerHorizontal: 50,
                length: 4,
                rotation: 0,
                positions: [{ x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }, { x: 1, y: 8 }],
                isOk: false,
                isVertical: true
            }
        ];
        const action = 40;
        const preparation90 = PreparationMethods.updatePreparationWithRotation(preparation0, action);
        expect(str(preparation90)).toBe(str([
            {
                key: 40,
                pos: { x: -1, y: 6 },
                center: { x: 1, y: 6 },
                centerVertical: 50,
                centerHorizontal: 62.5,
                length: 4,
                rotation: 90,
                positions: [{ x: -1, y: 6 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }],
                isOk: false,
                isVertical: false
            }
        ]));
        const preparation180 = PreparationMethods.updatePreparationWithRotation(preparation90, action);
        expect(str(preparation180)).toBe(str([
            {
                key: 40,
                pos: { x: 1, y: 4 },
                center: { x: 1, y: 6 },
                centerVertical: 62.5,
                centerHorizontal: 50,
                length: 4,
                rotation: 180,
                positions: [{ x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 }],
                isOk: true,
                isVertical: true
            }
        ]));
        const preparation270 = PreparationMethods.updatePreparationWithRotation(preparation180, action);
        expect(str(preparation270)).toBe(str([
            {
                key: 40,
                pos: { x: 0, y: 6 },
                center: { x: 1, y: 6 },
                centerVertical: 50,
                centerHorizontal: 37.5,
                length: 4,
                rotation: 270,
                positions: [{ x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }],
                isOk: true,
                isVertical: false
            }
        ]));
    });

});

describe('PreparationMethods reduceYardWithDrop', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('reduce null with null', () => {
        const state: PreparationShip[] = null;
        const action: PreparationDrop = null;
        const yard = PreparationMethods.updateYardWithDrop(state, action);
        expect(str(yard)).toBe(str([]));
    });

    it('reduce [] with null', () => {
        const state: PreparationShip[] = [];
        const action: PreparationDrop = null;
        const yard = PreparationMethods.updateYardWithDrop(state, action);
        expect(str(yard)).toBe(str([]));
    });

    it('reduce state with null', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = null;
        const yard = PreparationMethods.updateYardWithDrop(state, action);
        expect(str(yard)).toBe(str(state));
    });

    it('reduce state with drop (not existing key)', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = { key: 0, pos: { x: 3, y: 3 } };
        const yard = PreparationMethods.updateYardWithDrop(state, action);
        expect(str(yard)).toBe(str(state));
    });

    it('reduce state with drop (existing key)', () => {
        const state: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 0, y: 0 },
                center: { x: 0, y: 0 },
                centerVertical: 25,
                centerHorizontal: 50,
                length: 2,
                rotation: 0,
                positions: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
                isOk: true,
                isVertical: true
            }
        ];
        const action: PreparationDrop = { key: 20, pos: { x: 3, y: 3 } };
        const yard = PreparationMethods.updateYardWithDrop(state, action);
        expect(str(yard)).toBe(str([]));
    });

});

describe('PreparationMethods reduceValidWithPreparation', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('reduce with null', () => {
        const action: PreparationShip[] = null;
        const isValid = PreparationMethods.updateValidWithPreparation(true, action);
        expect(isValid).toBe(false);
    });

    it('reduce with []', () => {
        const action: PreparationShip[] = null;
        const isValid = PreparationMethods.updateValidWithPreparation(true, action);
        expect(isValid).toBe(false);
    });

    it('reduce with invalid preparation (ship 20 missing)', () => {
        const x = -1;
        const y = -1;
        const centerVertical = 0;
        const centerHorizontal = 0;
        const rotation = 0;
        const isOk = true;
        const isVertical = true;
        const action: PreparationShip[] = [
            {
                key: 30,
                pos: { x, y },
                center: { x: 1, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 31,
                pos: { x, y },
                center: { x: 2, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 40,
                pos: { x, y },
                center: { x: 3, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 41,
                pos: { x, y },
                center: { x: 4, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            }
        ];
        const isValid = PreparationMethods.updateValidWithPreparation(true, action);
        expect(isValid).toBe(false);
    });

    it('reduce with invalid preparation (ship 30 no ok)', () => {
        const x = -1;
        const y = -1;
        const centerVertical = 0;
        const centerHorizontal = 0;
        const rotation = 0;
        const isOk = true;
        const isVertical = true;
        const action: PreparationShip[] = [
            {
                key: 20,
                pos: { x, y },
                center: { x: 0, y: 0 },
                centerVertical,
                centerHorizontal,
                length: 2,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 30,
                pos: { x, y },
                center: { x: 1, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk: false,
                isVertical
            },
            {
                key: 31,
                pos: { x, y },
                center: { x: 2, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 40,
                pos: { x, y },
                center: { x: 3, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 41,
                pos: { x, y },
                center: { x: 4, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            }
        ];
        const isValid = PreparationMethods.updateValidWithPreparation(true, action);
        expect(isValid).toBe(false);
    });

    it('reduce with valid preparation', () => {
        const x = -1;
        const y = -1;
        const centerVertical = 0;
        const centerHorizontal = 0;
        const rotation = 0;
        const isOk = true;
        const isVertical = true;
        const action: PreparationShip[] = [
            {
                key: 20,
                pos: { x, y },
                center: { x: 0, y: 0 },
                centerVertical,
                centerHorizontal,
                length: 2,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 30,
                pos: { x, y },
                center: { x: 1, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 31,
                pos: { x, y },
                center: { x: 2, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 3,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 40,
                pos: { x, y },
                center: { x: 3, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            },
            {
                key: 41,
                pos: { x, y },
                center: { x: 4, y: 1 },
                centerVertical,
                centerHorizontal,
                length: 4,
                rotation,
                positions: [],
                isOk,
                isVertical
            }
        ];
        const isValid = PreparationMethods.updateValidWithPreparation(true, action);
        expect(isValid).toBe(true);
    });

});


describe('PreparationMethods createShips', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('create with null', () => {
        const preparationShips: PreparationShip[] = null;
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([]));
    });

    it('create with []', () => {
        const preparationShips: PreparationShip[] = null;
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([]));
    });

    it('create with ship 20 0', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 5, y: 5 },
                center: { x: 5, y: 5 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 2,
                rotation: 0,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 5, y: 5 },
                length: 2,
                orientation: 1,
                design: 20,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 20 90', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 4, y: 5 },
                center: { x: 5, y: 5 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 2,
                rotation: 90,
                positions: [],
                isOk: true,
                isVertical: false
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 5, y: 5 },
                length: 2,
                orientation: 2,
                design: 20,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 20 180', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 5, y: 4 },
                center: { x: 5, y: 5 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 2,
                rotation: 180,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 5, y: 5 },
                length: 2,
                orientation: 3,
                design: 20,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 20 270', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 20,
                pos: { x: 5, y: 5 },
                center: { x: 5, y: 5 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 2,
                rotation: 270,
                positions: [],
                isOk: true,
                isVertical: false
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 5, y: 5 },
                length: 2,
                orientation: 0,
                design: 20,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 30 0', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 30,
                pos: { x: 1, y: 0 },
                center: { x: 1, y: 1 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 3,
                rotation: 0,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 1, y: 0 },
                length: 3,
                orientation: 1,
                design: 30,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 30 90', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 30,
                pos: { x: 0, y: 1 },
                center: { x: 1, y: 1 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 3,
                rotation: 90,
                positions: [],
                isOk: true,
                isVertical: false
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 2, y: 1 },
                length: 3,
                orientation: 2,
                design: 30,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 30 180', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 30,
                pos: { x: 1, y: 0 },
                center: { x: 1, y: 1 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 3,
                rotation: 180,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 1, y: 2 },
                length: 3,
                orientation: 3,
                design: 30,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 30 270', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 30,
                pos: { x: 0, y: 1 },
                center: { x: 1, y: 1 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 3,
                rotation: 270,
                positions: [],
                isOk: true,
                isVertical: false
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 0, y: 1 },
                length: 3,
                orientation: 0,
                design: 30,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 40 0', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 40,
                pos: { x: 3, y: 2 },
                center: { x: 3, y: 3 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 4,
                rotation: 0,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 3, y: 2 },
                length: 4,
                orientation: 1,
                design: 40,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 40 90', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 40,
                pos: { x: 1, y: 3 },
                center: { x: 3, y: 3 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 4,
                rotation: 90,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 4, y: 3 },
                length: 4,
                orientation: 2,
                design: 40,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 40 180', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 40,
                pos: { x: 3, y: 1 },
                center: { x: 3, y: 3 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 4,
                rotation: 180,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 3, y: 4 },
                length: 4,
                orientation: 3,
                design: 40,
                isSunk: false,
                hits: []
            }
        ]));
    });

    it('create with ship 40 270', () => {
        const preparationShips: PreparationShip[] = [
            {
                key: 40,
                pos: { x: 2, y: 3 },
                center: { x: 3, y: 3 },
                centerVertical: 0,
                centerHorizontal: 0,
                length: 4,
                rotation: 270,
                positions: [],
                isOk: true,
                isVertical: true
            }
        ];
        const ships = PreparationMethods.createShips(preparationShips);
        expect(str(ships)).toBe(str([
            {
                pos: { x: 2, y: 3 },
                length: 4,
                orientation: 0,
                design: 40,
                isSunk: false,
                hits: []
            }
        ]));
    });


});
