import { HallEntry, PlayerLevel } from '@cloud-api/core-models';

export function reduceAdmiralsWithEntries(state: HallEntry[], action: HallEntry[]): HallEntry[] {
    const entries = action ? [...action] : [];
    const admirals = entries.filter((entry: HallEntry) => {
        return entry.playerInfo.level === PlayerLevel.Admiral;
    });
    return admirals;
}

export function reduceCaptainsWithEntries(state: HallEntry[], action: HallEntry[]): HallEntry[] {
    const entries = action ? [...action] : [];
    const captains = entries.filter((entry: HallEntry) => {
        return entry.playerInfo.level === PlayerLevel.Captain;
    });
    return captains;
}

export function reduceSeamenWithEntries(state: HallEntry[], action: HallEntry[]): HallEntry[] {
    const entries = action ? [...action] : [];
    const seamen = entries.filter((entry: HallEntry) => {
        return entry.playerInfo.level === PlayerLevel.Seaman;
    });
    return seamen;
}

export function reduceShipboysWithEntries(state: HallEntry[], action: HallEntry[]): HallEntry[] {
    const entries = action ? [...action] : [];
    const shipboy = entries.filter((entry: HallEntry) => {
        return entry.playerInfo.level === PlayerLevel.Shipboy;
    });
    return shipboy;
}
