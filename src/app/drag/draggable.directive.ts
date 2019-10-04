import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { DragService } from './drag.service';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective {
    private key: string;

    constructor(private dragService: DragService) {
    }

    @HostBinding('draggable')
    get draggable() {
        return true;
    }

    @Input()
    set appDraggable(obj: any) {
        this.key = obj.key;
    }

    @HostListener('dragstart', ['$event'])
    onDragStart(event: any) {
        this.dragService.start(this.key);
        event.dataTransfer.setData('key', this.key); // required for FF to work
    }
}
