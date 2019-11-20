import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HallEntry, HistoricBattle } from '@cloud-api/core-models';
import { CloudDataService } from '../backend/cloud-data.service';

@Component({
    templateUrl: './hall.component.html',
    styleUrls: ['./hall.component.scss']
})
export class HallComponent implements OnInit {

    hallEntries: HallEntry[] = [];
    historicBattles: HistoricBattle[] = [];

    constructor(private router: Router, private cloudData: CloudDataService) {
    }

    ngOnInit(): void {
        // TODO: this is just a quick test
        this.cloudData.getHallEntries().then(result => {
            this.hallEntries = result;
        });
        this.cloudData.getHistoricBattles().then(result => {
            this.historicBattles = result;
        });
    }

    onBattleClicked() {
        this.router.navigateByUrl('/preparation');
    }
}
