import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HallEntry, HistoricBattle } from '@cloud-api/core-models';
import { CloudDataService } from '../../backend/cloud-data.service';
import * as HallMethods from '../hall-methods';

@Component({
    templateUrl: './hall.component.html',
    styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

    private _admirals: HallEntry[] = [];
    private _captains: HallEntry[] = [];
    private _seamen: HallEntry[] = [];
    private _shipboys: HallEntry[] = [];

    historicBattles: HistoricBattle[] = [];

    constructor(private router: Router, private cloudData: CloudDataService) {
    }

    ngOnInit(): void {
        // TODO: this is just a quick test
        this.cloudData.getHallEntries().then(result => {
            this._admirals = HallMethods.reduceAdmiralsWithEntries(this._admirals, result);
            this._captains = HallMethods.reduceCaptainsWithEntries(this._captains, result);
            this._seamen = HallMethods.reduceSeamenWithEntries(this._seamen, result);
            this._shipboys = HallMethods.reduceShipboysWithEntries(this._shipboys, result);
        });
        this.cloudData.getHistoricBattles().then(result => {
            this.historicBattles = result;
        });
    }

    get hasAdmirals(): boolean {
        return 0 < this._admirals.length;
    }

    get hasCaptains(): boolean {
        return 0 < this._captains.length;
    }

    get hasSeamen(): boolean {
        return 0 < this._seamen.length;
    }

    get hasShipboys(): boolean {
        return 0 < this._shipboys.length;
    }

    get admirals(): HallEntry[] {
        return this._admirals;
    }

    get captains(): HallEntry[] {
        return this._captains;
    }

    get seamen(): HallEntry[] {
        return this._seamen;
    }

    get shipboys(): HallEntry[] {
        return this._shipboys;
    }

}
