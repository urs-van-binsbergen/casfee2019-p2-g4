import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-victory',
    templateUrl: './victory.component.html',
    styleUrls: ['./victory.component.scss']
})
export class VictoryComponent {

    @Output() restart = new EventEmitter<void>();

    constructor() {
    }

    onRestartClick() {
        this.restart.emit();
    }

}
