import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
<<<<<<< HEAD
import { AuthGuard } from '../auth/auth.guard';
import { MatchComponent } from './components/match.component';
import { MatchItemComponent } from './components/match-item.component';
import { MatchItemsComponent } from './components/match-items.component';

const routes: Routes = [{
    path: '',
    component: MatchComponent,
    canActivate: [AuthGuard]
}];
=======
import { MatchComponent } from './match.component';
import { MatchItemComponent } from './components/match-item.component';
import { MatchItemsComponent } from './components/match-items.component';
import { MatchService } from './match.service';
import { RouterModule } from '@angular/router';
>>>>>>> origin/master

@NgModule({
    declarations: [
        MatchComponent,
        MatchItemComponent,
        MatchItemsComponent
    ],
    imports: [
        SharedModule,
<<<<<<< HEAD
        RouterModule.forChild(routes)
=======
        RouterModule
    ],
    providers: [
        MatchService
    ],
    exports: [
        MatchComponent
>>>>>>> origin/master
    ]
})
export class MatchModule { }
