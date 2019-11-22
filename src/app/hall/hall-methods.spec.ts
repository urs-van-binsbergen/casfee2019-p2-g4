import * as HallMethods from './hall-methods';
import { HallEntry, PlayerLevel } from '@cloud-api/core-models';

function str(v: any): string {
    return JSON.stringify(v);
}

const admiral: HallEntry = {
    playerInfo: {
        uid: 'uid',
        displayName: 'admiral',
        avatarFileName: 'avatar',
        level: PlayerLevel.Admiral
    },
    numberOfVictories: 99,
    numberOfWaterloos: 44
};

const captain: HallEntry = {
    playerInfo: {
        uid: 'uid',
        displayName: 'captain',
        avatarFileName: 'avatar',
        level: PlayerLevel.Captain
    },
    numberOfVictories: 88,
    numberOfWaterloos: 33
};

const seaman: HallEntry = {
    playerInfo: {
        uid: 'uid',
        displayName: 'seaman',
        avatarFileName: 'avatar',
        level: PlayerLevel.Seaman
    },
    numberOfVictories: 77,
    numberOfWaterloos: 22
};

const shipboy: HallEntry = {
    playerInfo: {
        uid: 'uid',
        displayName: 'shipboy',
        avatarFileName: 'avatar',
        level: PlayerLevel.Shipboy
    },
    numberOfVictories: 66,
    numberOfWaterloos: 11
};

const entries = [admiral, captain, seaman, shipboy];


describe('HallMethods', () => {

    beforeEach(() => {
    });

    afterEach(() => {
    });

    it('reduce admirals with undefined', () => {
        const entriesBefore = str(undefined);
        const admiralsExpected = str([]);
        const admirals = HallMethods.reduceAdmiralsWithEntries(null, undefined);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with null', () => {
        const entriesBefore = str(null);
        const admiralsExpected = str([]);
        const admirals = HallMethods.reduceAdmiralsWithEntries(null, null);
        expect(str(null)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with []', () => {
        const entriesBefore = str([]);
        const admiralsExpected = str([]);
        const admirals = HallMethods.reduceAdmiralsWithEntries(null, []);
        expect(str([])).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with entries', () => {
        const entriesBefore = str(entries);
        const admiralsExpected = str([admiral]);
        const admirals = HallMethods.reduceAdmiralsWithEntries(null, entries);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);

    });

    it('reduce captains with undefined', () => {
        const entriesBefore = str(undefined);
        const captainsExpected = str([]);
        const captains = HallMethods.reduceCaptainsWithEntries(null, undefined);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with null', () => {
        const entriesBefore = str(null);
        const captainsExpected = str([]);
        const captains = HallMethods.reduceCaptainsWithEntries(null, null);
        expect(str(null)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with []', () => {
        const entriesBefore = str([]);
        const captainsExpected = str([]);
        const captains = HallMethods.reduceCaptainsWithEntries(null, []);
        expect(str([])).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with entries', () => {
        const entriesBefore = str(entries);
        const captainsExpected = str([captain]);
        const captains = HallMethods.reduceCaptainsWithEntries(null, entries);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);

    });

    it('reduce seamen with undefined', () => {
        const entriesBefore = str(undefined);
        const seamenExpected = str([]);
        const seamen = HallMethods.reduceSeamenWithEntries(null, undefined);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with null', () => {
        const entriesBefore = str(null);
        const seamenExpected = str([]);
        const seamen = HallMethods.reduceSeamenWithEntries(null, null);
        expect(str(null)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with []', () => {
        const entriesBefore = str([]);
        const seamenExpected = str([]);
        const seamen = HallMethods.reduceSeamenWithEntries(null, []);
        expect(str([])).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with entries', () => {
        const entriesBefore = str(entries);
        const seamenExpected = str([seaman]);
        const seamen = HallMethods.reduceSeamenWithEntries(null, entries);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);

    });

    it('reduce shipboys with undefined', () => {
        const entriesBefore = str(undefined);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.reduceShipboysWithEntries(null, undefined);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with null', () => {
        const entriesBefore = str(null);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.reduceShipboysWithEntries(null, null);
        expect(str(null)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with []', () => {
        const entriesBefore = str([]);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.reduceShipboysWithEntries(null, []);
        expect(str([])).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with entries', () => {
        const entriesBefore = str(entries);
        const shipboysExpected = str([shipboy]);
        const shipboys = HallMethods.reduceShipboysWithEntries(null, entries);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);

    });

});
