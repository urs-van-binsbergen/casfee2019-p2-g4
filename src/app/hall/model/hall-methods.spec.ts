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
        const admirals = HallMethods.filterByLevel(undefined, PlayerLevel.Admiral);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with null', () => {
        const entriesBefore = str(null);
        const admiralsExpected = str([]);
        const admirals = HallMethods.filterByLevel(null, PlayerLevel.Admiral);
        expect(str(null)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with []', () => {
        const entriesBefore = str([]);
        const admiralsExpected = str([]);
        const admirals = HallMethods.filterByLevel([], PlayerLevel.Admiral);
        expect(str([])).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);
    });

    it('reduce admirals with entries', () => {
        const entriesBefore = str(entries);
        const admiralsExpected = str([admiral]);
        const admirals = HallMethods.filterByLevel(entries, PlayerLevel.Admiral);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(admirals)).toBe(admiralsExpected);

    });

    it('reduce captains with undefined', () => {
        const entriesBefore = str(undefined);
        const captainsExpected = str([]);
        const captains = HallMethods.filterByLevel(undefined, PlayerLevel.Captain);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with null', () => {
        const entriesBefore = str(null);
        const captainsExpected = str([]);
        const captains = HallMethods.filterByLevel(null, PlayerLevel.Captain);
        expect(str(null)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with []', () => {
        const entriesBefore = str([]);
        const captainsExpected = str([]);
        const captains = HallMethods.filterByLevel([], PlayerLevel.Captain);
        expect(str([])).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);
    });

    it('reduce captains with entries', () => {
        const entriesBefore = str(entries);
        const captainsExpected = str([captain]);
        const captains = HallMethods.filterByLevel(entries, PlayerLevel.Captain);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(captains)).toBe(captainsExpected);

    });

    it('reduce seamen with undefined', () => {
        const entriesBefore = str(undefined);
        const seamenExpected = str([]);
        const seamen = HallMethods.filterByLevel(undefined, PlayerLevel.Seaman);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with null', () => {
        const entriesBefore = str(null);
        const seamenExpected = str([]);
        const seamen = HallMethods.filterByLevel(null, PlayerLevel.Seaman);
        expect(str(null)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with []', () => {
        const entriesBefore = str([]);
        const seamenExpected = str([]);
        const seamen = HallMethods.filterByLevel([], PlayerLevel.Seaman);
        expect(str([])).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);
    });

    it('reduce seamen with entries', () => {
        const entriesBefore = str(entries);
        const seamenExpected = str([seaman]);
        const seamen = HallMethods.filterByLevel(entries, PlayerLevel.Seaman);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(seamen)).toBe(seamenExpected);

    });

    it('reduce shipboys with undefined', () => {
        const entriesBefore = str(undefined);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.filterByLevel(undefined, PlayerLevel.Shipboy);
        expect(str(undefined)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with null', () => {
        const entriesBefore = str(null);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.filterByLevel(null, PlayerLevel.Shipboy);
        expect(str(null)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with []', () => {
        const entriesBefore = str([]);
        const shipboysExpected = str([]);
        const shipboys = HallMethods.filterByLevel([], PlayerLevel.Shipboy);
        expect(str([])).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);
    });

    it('reduce shipboys with entries', () => {
        const entriesBefore = str(entries);
        const shipboysExpected = str([shipboy]);
        const shipboys = HallMethods.filterByLevel(entries, PlayerLevel.Shipboy);
        expect(str(entries)).toBe(entriesBefore);
        expect(str(shipboys)).toBe(shipboysExpected);

    });

});
