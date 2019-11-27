import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { VictoryComponent } from './victory.component';

const routes: Routes = [{
    path: 'legacy',
    component: VictoryComponent
}];

@NgModule({
    declarations: [
        VictoryComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        VictoryComponent
    ]
})
export class VictoryModule { }
