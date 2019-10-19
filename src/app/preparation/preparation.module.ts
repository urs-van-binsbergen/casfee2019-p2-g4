import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DragModule } from '../drag/drag.module';
import { AuthGuard } from '../auth/auth.guard';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationShipComponent } from './components/preparation-ship.component';
import { PreparationGuard } from './preparation.guard';
import { YardService } from './yard.service';

const routes: Routes = [{
    path: '',
    component: PreparationComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PreparationGuard]
}];

@NgModule({
    declarations: [
        PreparationComponent,
        PreparationShipComponent
    ],
    imports: [
        SharedModule,
        DragModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        PreparationGuard,
        PreparationService,
        YardService
    ]
})
export class PreparationModule { }
