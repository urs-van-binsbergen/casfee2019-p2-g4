import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { PreparationComponent } from './preparation.component';

@Injectable()
export class PreparationGuard implements CanDeactivate<PreparationComponent> {

    canDeactivate(target: PreparationComponent) {
        if (target.isChanged) {
            return window.confirm('Do you really want to cancel?');
        }
        return true;
      }

}
