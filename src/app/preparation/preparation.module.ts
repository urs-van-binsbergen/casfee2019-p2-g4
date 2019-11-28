import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DraggableDirective } from './drag/draggable.directive';
import { DropTargetDirective } from './drag/droptarget.directive';
import { DragService } from './drag/drag.service';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationBoardComponent } from './components/preparation-board.component';
import { PreparationShipComponent } from './components/preparation-ship.component';
import { PreparationStatusComponent } from './components/preparation-status.component';
import { PreparationYardComponent } from './components/preparation-yard.component';
import { PreparationGuard } from './preparation.guard';
import { YardService } from './yard.service';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        DraggableDirective,
        DropTargetDirective,
        PreparationComponent,
        PreparationBoardComponent,
        PreparationShipComponent,
        PreparationStatusComponent,
        PreparationYardComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        DragService,
        PreparationGuard,
        PreparationService,
        YardService
    ],
    exports: [
        PreparationComponent
    ]
})
export class PreparationModule { }
