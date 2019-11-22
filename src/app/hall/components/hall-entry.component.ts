import { Component, Input } from '@angular/core';
import { HallEntry } from '@cloud-api/core-models';

@Component({
    selector: 'app-hall-entry',
    templateUrl: './hall-entry.component.html',
    styleUrls: ['./hall-entry.component.scss']
})
export class HallEntryComponent {
    @Input()
    public entry: HallEntry;
}
