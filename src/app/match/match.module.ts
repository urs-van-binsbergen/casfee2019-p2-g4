import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './match.component';
import { MatchItemComponent } from './components/match-item.component';
import { MatchItemsComponent } from './components/match-items.component';
import { MatchService } from './match.service';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        MatchComponent,
        MatchItemComponent,
        MatchItemsComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        MatchService
    ],
    exports: [
        MatchComponent
    ]
})
export class MatchModule { }
