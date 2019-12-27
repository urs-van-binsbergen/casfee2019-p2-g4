import { Injectable } from '@angular/core';
import { PreparationDrop } from '../model/preparation-models';
import { Pos } from '@cloud-api/geometry';
import { Observable, Subject } from 'rxjs';

const delay = 250;
const shipOpacityDragging = 0.75;
const shipOpacityPlaced = 0.5;
const fieldOpacityEntered = 0.25;
const fieldOpacityLeft = 1.0;

enum ClickState {
    Idle,
    Pending,
    Dragging
}

interface XY {
    x: number;
    y: number;
}

function shipKey(event: any): number {
    if (event && event.target && event.target.dataset && event.target.dataset.key) {
        const key = parseInt(event.target.dataset.key, 10);
        return key;
    }
    return null;
}

function fieldPosXY(element: any): XY {
    if (element && element.dataset.fieldposx && element.dataset.fieldposy) {
        const x = parseInt(element.dataset.fieldposx, 10);
        const y = parseInt(element.dataset.fieldposy, 10);
        if (!(Number.isNaN(x)) && !(Number.isNaN(y))) {
            return { x, y };
        }
    }
    return null;
}

function clientXY(event: any): XY {
    if (event.type === 'touchstart' || event.type === 'touchmove') {
        return {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
    return {
        x: event.clientX,
        y: event.clientY
    };
}

function draggingXY(element: any): XY {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left - 5,
        y: rect.top - 5
    };
}

@Injectable()
export class PreparationInteractionService {

    private _drop: Subject<PreparationDrop>;
    private _rotate: Subject<number>;
    private _clickState: ClickState = ClickState.Idle;
    private _timeout: any;
    private _key: number;
    private _target: any;
    private _start: XY;
    private _pos: Pos;
    private _element: any = null;

    constructor() {
        this._drop = new Subject<PreparationDrop>();
        this._rotate = new Subject<number>();
    }

    public get drop$(): Observable<PreparationDrop> {
        return this._drop.asObservable();
    }

    public get rotate$(): Observable<number> {
        return this._rotate.asObservable();
    }

    public onStart(event: any): boolean {
        if (this._clickState === ClickState.Idle) {
            const key = shipKey(event);
            if (key) {
                const dragging = draggingXY(event.target);
                this._start = { x: dragging.x, y: dragging.y };
                this._target = event.target;
                this._key = key;
                this._clickState = ClickState.Pending;
                this._timeout = setTimeout(() => {
                    if (this._clickState === ClickState.Pending) {
                        this._clickState = ClickState.Dragging;
                    }
                }, delay);
                return true;
            }
        }
        return false;
    }

    private resetElementPos(): void {
        if (this._element) {
            this._element.style.opacity = fieldOpacityLeft;
        }
        this._element = null;
        this._pos = null;
    }

    private updateElementPos(point: XY): void {
        const element = document.elementFromPoint(point.x, point.y);
        if (this._element !== element) {
            this.resetElementPos();
            const pos = fieldPosXY(element);
            if (pos) {
                this._element = element;
                this._pos = pos;
                this._element.style.opacity = fieldOpacityEntered;
            }
        }
    }

    public onContinue(event: any): boolean {
        if (this._clickState === ClickState.Dragging) {
            const client = clientXY(event);
            const x = client.x - this._start.x;
            const y = client.y - this._start.y;
            this._target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
            this._target.style.opacity = shipOpacityDragging;
            this.updateElementPos(client);
            return true;
        }
        return false;
    }

    public onStop(event: any): boolean {
        clearTimeout(this._timeout);
        switch (this._clickState) {
            case ClickState.Pending:
                this.onRotate();
                break;
            case ClickState.Dragging:
                if (!(this.onDrop())) {
                    this._target.style.transform = null;
                }
                this._target.style.opacity = shipOpacityPlaced;
                break;
        }
        this._clickState = ClickState.Idle;
        this.resetElementPos();
        return true;
    }

    public onRotate(): void {
        if (this._key) {
            this._rotate.next(this._key);
        }
    }

    public onDrop(): boolean {
        if (this._key && this._pos) {
            const drop: PreparationDrop = {
                key: this._key,
                pos: { ...this._pos }
            };
            this._drop.next(drop);
            this._pos = null;
            return true;
        }
        return false;
    }

}
