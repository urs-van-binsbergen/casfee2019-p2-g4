import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { UserComponent } from './components/user.component';
import { UpdateProfileComponent } from './components/update-profile.component';
import { UpdatePasswordComponent } from './components/update-password.component';

const routes: Routes = [
    {
        // (component-less route)
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileComponent },
            { path: 'update-password', component: UpdatePasswordComponent },
            { path: '', component: UserComponent }
        ],
    }
];

@NgModule({
    declarations: [
        UserComponent,
        UpdateProfileComponent,
        UpdatePasswordComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class UserModule { }
