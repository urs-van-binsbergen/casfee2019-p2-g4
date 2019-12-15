import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { UserComponent } from './components/user/user.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { MyBattleListComponent } from './components/my-battle-list/my-battle-list.component';

const routes: Routes = [
    {
        // (component-less route)
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileComponent },
            { path: '', component: UserComponent }
        ],
    }
];

@NgModule({
    declarations: [
        UserComponent,
        UpdateProfileComponent,
        MyBattleListComponent
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    providers: [
    ]
})
export class UserModule { }
