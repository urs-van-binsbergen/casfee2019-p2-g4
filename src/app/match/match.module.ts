import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { MatchComponent } from './match.component';

const routes: Routes = [{
    path: '',
    component: MatchComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        MatchComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class MatchModule { }
