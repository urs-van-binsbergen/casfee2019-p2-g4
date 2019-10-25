import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DraggableDirective } from './drag/draggable.directive';
import { DropTargetDirective } from './drag/droptarget.directive';
import { DragService } from './drag/drag.service';
import { AuthGuard } from '../auth/auth.guard';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationBoardComponent } from './components/preparation-board.component';
import { PreparationShipComponent } from './components/preparation-ship.component';
import { PreparationYardComponent } from './components/preparation-yard.component';
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
        DraggableDirective,
        DropTargetDirective,
        PreparationComponent,
        PreparationBoardComponent,
        PreparationShipComponent,
        PreparationYardComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [
        DragService,
        PreparationGuard,
        PreparationService,
        YardService
    ]
})
export class PreparationModule { }
