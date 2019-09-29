import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { UserComponent } from './user.component';

const routes: Routes = [{
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class UserModule { }
