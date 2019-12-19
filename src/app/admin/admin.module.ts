import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [{
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
