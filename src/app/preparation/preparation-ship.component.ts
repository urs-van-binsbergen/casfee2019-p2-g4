import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-preparation-ship',
    templateUrl: './preparation-ship.component.html',
    styleUrls: ['./preparation-ship.component.scss']
})
export class PreparationShipComponent implements OnInit {
    constructor() {
    }

    @Input() key: string = null;

    ngOnInit(): void {
    }

    get shipClass(): string {
        let shipClass: string;
        if (this.key === 'red') {
            shipClass = 'ship3';
        } else if (this.key === 'green' || this.key === 'blue') {
            shipClass = 'ship3';
        } else {
            shipClass = 'ship5';
        }
        return shipClass;
    }

    get items(): number[] {
        let items: number[];
        if (this.key === 'red') {
            items = [0, 1];
        } else if (this.key === 'green' || this.key === 'blue') {
            items = [0, 1, 2];
        } else {
            items = [0, 1, 2, 3];
        }
        return items;
    }
}
