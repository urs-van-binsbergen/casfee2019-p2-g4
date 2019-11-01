import { Injectable } from '@angular/core';
import { MatchItem } from './match-item';

@Injectable()
export class MatchService {

    private _items: MatchItem[];

    constructor() {
        this._items = [
            new MatchItem('match0'),
            new MatchItem('match1'),
            new MatchItem('match2'),
            new MatchItem('match3'),
            new MatchItem('match4')
        ];
    }

    get items(): MatchItem[] {
        return this._items;
    }
}
