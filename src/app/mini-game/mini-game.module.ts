import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';
import { MiniBattleComponent } from './mini-battle.component';
import { MiniGameComponent } from './mini-game.component';
import { MiniMatchComponent } from './mini-match.component';
import { MiniPrepComponent } from './mini-prep.component';

const routes: Routes = [
    {
        // (component-less route)
        path: '',
        canActivate: [AuthGuard],
        children: [
            { path: 'battle', component: MiniBattleComponent },
            { path: 'match', component: MiniMatchComponent },
            { path: 'prep', component: MiniPrepComponent },
            { path: '', component: MiniGameComponent },
        ],
    }
];


@NgModule({
    declarations: [
        MiniBattleComponent,
        MiniGameComponent,
        MiniMatchComponent,
        MiniPrepComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class MiniGameModule { }
