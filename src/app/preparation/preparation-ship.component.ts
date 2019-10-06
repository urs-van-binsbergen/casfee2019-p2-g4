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

    get items(): number[] {
        let items: number[];
        if (this.key === 'green') {
            items = [0, 1];
        } else if (this.key === 'grey') {
            items = [0, 1];
        } else {
            items = [0, 1, 2];
        }
        return items;
    }
}
