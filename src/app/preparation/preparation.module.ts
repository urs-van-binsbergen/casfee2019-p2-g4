import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationGuard } from './preparation.guard';

const routes: Routes = [{
    path: '',
    component: PreparationComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PreparationGuard]
}];

@NgModule({
    declarations: [
        PreparationComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        PreparationService,
        PreparationGuard
    ]
})
export class PreparationModule { }
