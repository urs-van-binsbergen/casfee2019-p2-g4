import { expect } from 'chai';
import { Orientation } from './core-models';
import { getShipPositions, newPos, newShip } from './core-methods';

describe('getShipPositions()', () => {

    it('a length 2 newShip at 0/0 oriented east should be at 0-1/0', () => {
        expect(
            getShipPositions(newShip(newPos(0, 0), 2, Orientation.East))
        ).to.eql([ newPos(0, 0), newPos(1, 0) ]);
    });
    it('a length 4 newShip at 4/4 oriented north should be at 4/4-1', () => {
        expect(
            getShipPositions(newShip(newPos(4, 4), 4, Orientation.North))
        ).to.eql([ newPos(4, 4), newPos(4, 3), newPos(4, 2), newPos(4, 1) ]);
    });

});
