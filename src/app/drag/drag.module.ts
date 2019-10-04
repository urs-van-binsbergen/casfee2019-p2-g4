import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DropTargetDirective } from './droptarget.directive';
import { DragService } from './drag.service';

@NgModule({
    declarations: [
        DraggableDirective,
        DropTargetDirective
    ],
    exports: [
        DraggableDirective,
        DropTargetDirective
    ],
    providers: [
        DragService
    ]
})
export class DragModule {
}
