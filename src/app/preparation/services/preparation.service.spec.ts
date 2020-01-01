import { PreparationService } from './preparation.service';

function str(v: any): string {
    return JSON.stringify(v);
}

describe('PreparationService', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('loadYard preparation ship 20', () => {
        const preparationService = new PreparationService();
        const preparation = preparationService.loadYard();
        const preparationShip = {
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
        };
        expect(str(preparation[0])).toBe(str(preparationShip));
    });

    it('loadYard preparation ship 30', () => {
        const preparationService = new PreparationService();
        const preparation = preparationService.loadYard();
        const preparationShip = {
            key: 30,
            pos: { x: 1, y: 0 },
            center: { x: 1, y: 1 },
            centerVertical: 50,
            centerHorizontal: 50,
            length: 3,
            rotation: 0,
            positions: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
            isOk: true,
            isVertical: true
        };
        expect(str(preparation[1])).toBe(str(preparationShip));
    });

    it('loadYard preparation ship 31', () => {
        const preparationService = new PreparationService();
        const preparation = preparationService.loadYard();
        const preparationShip = {
            key: 31,
            pos: { x: 2, y: 0 },
            center: { x: 2, y: 1 },
            centerVertical: 50,
            centerHorizontal: 50,
            length: 3,
            rotation: 0,
            positions: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
            isOk: true,
            isVertical: true
        };
        expect(str(preparation[2])).toBe(str(preparationShip));
    });

    it('loadYard preparation ship 40', () => {
        const preparationService = new PreparationService();
        const preparation = preparationService.loadYard();
        const preparationShip = {
            key: 40,
            pos: { x: 3, y: 0 },
            center: { x: 3, y: 1 },
            centerVertical: 37.5,
            centerHorizontal: 50,
            length: 4,
            rotation: 0,
            positions: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
            isOk: true,
            isVertical: true
        };
        expect(str(preparation[3])).toBe(str(preparationShip));
    });

    it('loadYard preparation ship 41', () => {
        const preparationService = new PreparationService();
        const preparation = preparationService.loadYard();
        const preparationShip = {
            key: 41,
            pos: { x: 4, y: 0 },
            center: { x: 4, y: 1 },
            centerVertical: 37.5,
            centerHorizontal: 50,
            length: 4,
            rotation: 0,
            positions: [{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }],
            isOk: true,
            isVertical: true
        };
        expect(str(preparation[4])).toBe(str(preparationShip));
    });

    it('loadBoard', () => {
        const preparationService = new PreparationService();
        const board = preparationService.loadBoard(2, 3);
        const ref = [
            {
                fields:
                    [
                        { x: 0, y: 0 },
                        { x: 1, y: 0 }
                    ]
            },
            {
                fields:
                    [
                        { x: 0, y: 1 },
                        { x: 1, y: 1 }
                    ]
            },
            {
                fields:
                    [
                        { x: 0, y: 2 },
                        { x: 1, y: 2 }
                    ]
            }
        ];
        expect(str(board)).toBe(str(ref));
    });
});
