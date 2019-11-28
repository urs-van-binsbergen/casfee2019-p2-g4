import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss']
})
export class VictoryComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
        console.log('victory init');
    }

    ngOnDestroy(): void {
        console.log('victory destroy');
    }

}
