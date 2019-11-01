import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { MatchComponent } from './match.component';
import { MatchItemComponent } from './components/match-item.component';
import { MatchItemsComponent } from './components/match-items.component';
import { MatchService } from './match.service';

const routes: Routes = [{
    path: '',
    component: MatchComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        MatchComponent,
        MatchItemComponent,
        MatchItemsComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        MatchService
    ]
})
export class MatchModule { }
