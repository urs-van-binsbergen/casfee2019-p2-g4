import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HallEntry, PlayerLevel } from '@cloud-api/core-models';
import { CloudDataService } from '../../backend/cloud-data.service';
import * as HallMethods from '../hall-methods';

@Component({
    templateUrl: './hall.component.html'
})
export class HallComponent implements OnInit {

    private _admirals: HallEntry[] = [];
    private _captains: HallEntry[] = [];
    private _seamen: HallEntry[] = [];
    private _shipboys: HallEntry[] = [];

    constructor(private router: Router, private cloudData: CloudDataService) {
    }

    ngOnInit(): void {
        this.cloudData.getHallEntries().then(result => {
            this._admirals = HallMethods.filterByLevel(result, PlayerLevel.Admiral);
            this._captains = HallMethods.filterByLevel(result, PlayerLevel.Captain);
            this._seamen = HallMethods.filterByLevel(result, PlayerLevel.Seaman);
            this._shipboys = HallMethods.filterByLevel(result, PlayerLevel.Shipboy);
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
