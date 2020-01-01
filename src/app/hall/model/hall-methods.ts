import { HallEntry, PlayerLevel } from '@cloud-api/core-models';

export function filterByLevel(entries: HallEntry[], level: PlayerLevel): HallEntry[] {
    if (entries) {
        return entries.filter((entry: HallEntry) => {
            return entry.playerInfo.level === level;
        });
    }
    return [];
}
