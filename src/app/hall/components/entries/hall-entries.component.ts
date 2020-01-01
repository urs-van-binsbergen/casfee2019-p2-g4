import { Component, Input } from '@angular/core';
import { HallEntry } from '@cloud-api/core-models';

@Component({
    selector: 'app-hall-entries',
    templateUrl: './hall-entries.component.html',
    styleUrls: ['./hall-entries.component.scss']
})
export class HallEntriesComponent {
    @Input()
    public entries: HallEntry[];
}
