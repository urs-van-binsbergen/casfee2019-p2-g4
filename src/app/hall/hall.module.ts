import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HallComponent } from './components/hall.component';
import { HallEntriesComponent } from './components/hall-entries.component';
import { HallEntryComponent } from './components/hall-entry.component';
import { NgxsModule } from '@ngxs/store';
import { HallState } from './state/hall.state';

const routes: Routes = [{
    path: '',
    component: HallComponent
}];

@NgModule({
    declarations: [
        HallComponent,
        HallEntriesComponent,
        HallEntryComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        NgxsModule.forFeature([HallState]),
    ],
})
export class HallModule { }
