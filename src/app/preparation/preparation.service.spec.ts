import { PreparationService } from './preparation.service';

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
        preparationService.change();
        expect(preparationService.isChanged).toBeTruthy();
    });

    it('isChanged should be false after reset', () => {
        preparationService.change();
        preparationService.reset();
        expect(preparationService.isChanged).toBeFalsy();
    });
});
