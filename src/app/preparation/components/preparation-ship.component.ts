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

    @Input() place: string;

    ngOnInit(): void {
    }

    get shipClass(): string {
        let shipClass: string;
        if (this.key === 'red') {
            shipClass = this.place + 'Ship2';
        } else if (this.key === 'green' || this.key === 'blue') {
            shipClass = this.place + 'Ship3';
        } else {
            shipClass = this.place + 'Ship4';
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

    fieldClass(item: number): string {
        let fieldClass: string;
        if (item === 1) {
            fieldClass = 'towerField';
        } else {
            fieldClass = 'hullField';
        }
        return fieldClass;
    }
}
