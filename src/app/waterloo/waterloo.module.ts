import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WaterlooComponent } from './waterloo.component';

const routes: Routes = [{
    path: 'legacy', // TODO
    component: WaterlooComponent
}];

@NgModule({
    declarations: [
        WaterlooComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        WaterlooComponent
    ]
})
export class WaterlooModule { }
