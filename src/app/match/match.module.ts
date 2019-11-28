import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { MatchComponent } from './components/match.component';
import { MatchItemComponent } from './components/match-item.component';
import { MatchItemsComponent } from './components/match-items.component';

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
    ]
})
export class MatchModule { }
