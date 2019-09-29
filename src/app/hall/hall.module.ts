import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HallComponent } from './hall.component';

const routes: Routes = [{
    path: '',
    component: HallComponent
}];

@NgModule({
    declarations: [
        HallComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [
    ]
})
export class HallModule { }
