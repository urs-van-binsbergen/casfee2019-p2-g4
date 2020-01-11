import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-waterloo',
    templateUrl: './waterloo.component.html',
    styleUrls: ['./waterloo.component.scss']
})
export class WaterlooComponent {

    @Output() restart = new EventEmitter<void>();

    constructor() {
    }

    onRestartClick() {
        this.restart.emit();
    }

}
