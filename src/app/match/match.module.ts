import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './components/match.component';
import { MatchItemComponent } from './components/item/match-item.component';
import { MatchItemsComponent } from './components/items/match-items.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { MatchState } from './state/match.state';

@NgModule({
    declarations: [
        MatchComponent,
        MatchItemComponent,
        MatchItemsComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
        NgxsModule.forFeature([MatchState])
    ],
    exports: [
        MatchComponent
    ]
})
export class MatchModule { }
