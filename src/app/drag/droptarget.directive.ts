import { Directive, Input, Output, HostListener, EventEmitter, Renderer2 } from '@angular/core';
import { DragService } from './drag.service';

@Directive({
    selector: '[appDroptarget]'
})
export class DropTargetDirective {
    private x: number;
    private y: number;

    constructor(private dragService: DragService, private renderer: Renderer2) {
    }

    @Input()
    set appDroptarget(obj: any) {
        this.x = Number(obj.x);
        this.y = Number(obj.y);
    }

    @HostListener('dragenter', ['$event'])
    onDragEnter(event: any) {
        if (this.dragService.canDropDraggable(this.x, this.y)) {
            this.dragService.enterDropTarget(this.x, this.y);
            event.preventDefault();
        }
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: any) {
        if (this.dragService.canDropDraggable(this.x, this.y)) {
            event.preventDefault();
        }
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: any) {
        if (this.dragService.canDropDraggable(this.x, this.y)) {
            this.dragService.leaveDropTarget(this.x, this.y);
            event.preventDefault();
        }
    }

    @HostListener('drop', ['$event'])
    onDrop(event: any) {
        const key = this.dragService.dropDraggable(this.x, this.y);
        if (key !== null) {
            this.dragService.leaveDropTarget(this.x, this.y);
            event.preventDefault();
        }
    }
}
