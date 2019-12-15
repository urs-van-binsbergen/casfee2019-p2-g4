import { Component, Input } from '@angular/core';
import { BattleListModel } from './my-battle-list.model';

@Component({
    selector: 'app-my-battle-list',
    templateUrl: './my-battle-list.component.html'
})
export class MyBattleListComponent {
    @Input() myBattleList: BattleListModel;

    displayedColumns: string[] = ['endDate', 'opponent', 'result'];

}
