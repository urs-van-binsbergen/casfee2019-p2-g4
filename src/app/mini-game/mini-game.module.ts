import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { MiniGameComponent } from './components/mini-game.component';

const routes: Routes = [
    {
        // (component-less route)
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: MiniGameComponent },
        ],
    }
];


@NgModule({
    declarations: [
        MiniGameComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class MiniGameModule { }
