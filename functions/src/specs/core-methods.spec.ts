import { expect } from 'chai';
import { Orientation, sliceVector } from '../public/geometry';

describe('sliceVector()', () => {

    it('is 0/0 - 0/1 for a vector of origin 0/0, length 2, oriented East', () => {
        const v1 = {
            origin: { x: 0, y: 0 },
            length: 2,
            orientation: Orientation.East
        };
        expect(sliceVector(v1)).to.eql([
            { x: 0, y: 0 },
            { x: 1, y: 0 }
        ]);
    });
    it('is 4/4 - 4/3 - 4/2 - 4/1 for a vector of origin 4/4, length 4, oriented North', () => {
        const v2 = {
            origin: { x: 4, y: 4}, 
            length: 4, 
            orientation: Orientation.North
        }
        expect(sliceVector(v2)).to.eql([
            { x: 4, y: 4 },
            { x: 4, y: 3 },
            { x: 4, y: 2 },
            { x: 4, y: 1 }
        ]);
    });

});
