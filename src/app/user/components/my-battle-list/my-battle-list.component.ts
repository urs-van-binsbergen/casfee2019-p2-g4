import { Component, Input } from '@angular/core';
import { MyBattleListState } from './my-battle-list.state';

@Component({
    selector: 'app-my-battle-list',
    templateUrl: './my-battle-list.component.html'
})
export class MyBattleListComponent {
    @Input() state: MyBattleListState;

    displayedColumns: string[] = ['endDate', 'opponent', 'result'];

}
