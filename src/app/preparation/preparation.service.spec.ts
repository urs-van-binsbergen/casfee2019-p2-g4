import { PreparationService } from './preparation.service';
import { Ship } from '../shared/ship';

describe('PreparationService', () => {
    let preparationService: PreparationService;

    beforeEach(() => {
        preparationService = new PreparationService();
    });

    afterEach(() => {
        preparationService = null;
    });

    it('isChanged should be initialized to false', () => {
        expect(preparationService.isChanged).toBeFalsy();
    });

    it('isChanged should be true after change', () => {
        const ship = new Ship('red');
        preparationService.addShip(ship, 2, 2);
        expect(preparationService.isChanged).toBeTruthy();
    });

    it('isChanged should be false after reset', () => {
        preparationService.reset();
        expect(preparationService.isChanged).toBeFalsy();
    });
});
