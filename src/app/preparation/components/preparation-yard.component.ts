import { Component, OnInit } from '@angular/core';
import { YardService } from '../yard.service';

@Component({
    selector: 'app-preparation-yard',
    templateUrl: './preparation-yard.component.html',
    styleUrls: ['./preparation-yard.component.scss']
})
export class PreparationYardComponent implements OnInit {

    constructor(private yardService: YardService) {
    }

    ngOnInit(): void {
    }

    get yardKeys(): string[] {
        const ships = this.yardService.ships;
        const keys: string[] = [];
        ships.forEach((ship) => {
            keys.push(ship.key);
        });
        return keys;
    }

}
