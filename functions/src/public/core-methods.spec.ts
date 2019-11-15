import { expect } from 'chai';
import { Orientation } from './core-models';
import { getShipPositions, posOf, shipOf } from './core-methods';

describe('getShipPositions()', () => {

    it('a length 2 shipOf at 0/0 oriented east should be at 0-1/0', () => {
        expect(
            getShipPositions(shipOf(posOf(0, 0), 2, Orientation.East))
        ).to.eql([ posOf(0, 0), posOf(1, 0) ]);
    });
    it('a length 4 shipOf at 4/4 oriented north should be at 4/4-1', () => {
        expect(
            getShipPositions(shipOf(posOf(4, 4), 4, Orientation.North))
        ).to.eql([ posOf(4, 4), posOf(4, 3), posOf(4, 2), posOf(4, 1) ]);
    });

});
