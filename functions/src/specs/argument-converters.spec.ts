import { expect } from 'chai';
import { convertEnum } from '../shared/argument-converters';
import { Orientation } from '../public/geometry';

describe('convertEnum()', () => {

    it('converts 0 and \'East\' to East', () => {
        expect(convertEnum(Orientation, 0)).to.eql(Orientation.East);
        expect(convertEnum(Orientation, 'East')).to.eql(Orientation.East);
    });
    it('converts 1 and \'South\' to South', () => {
        expect(convertEnum(Orientation, 1)).to.eql(Orientation.South);
        expect(convertEnum(Orientation, 'South')).to.eql(Orientation.South);
    });
    it('converts 2 and \'West\' to West', () => {
        expect(convertEnum(Orientation, 2)).to.eql(Orientation.West);
        expect(convertEnum(Orientation, 'West')).to.eql(Orientation.West);
    });
    it('converts 3 and \'North\' to North', () => {
        expect(convertEnum(Orientation, 3)).to.eql(Orientation.North);
        expect(convertEnum(Orientation, 'North')).to.eql(Orientation.North);
    });

    it('throws on anything else', () => {
        expect(() => { convertEnum(Orientation, 4); }).to.throw();
        expect(() => { convertEnum(Orientation, -1); }).to.throw();
        expect(() => { convertEnum(Orientation, 'Atlantis'); }).to.throw();
        expect(() => { convertEnum(Orientation, true); }).to.throw();
        expect(() => { convertEnum(Orientation, {}); }).to.throw();
    });


});
