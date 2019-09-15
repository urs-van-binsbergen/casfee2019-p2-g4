import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { DialogModule } from '../dialog/dialog.module';
import { RouterModule } from '@angular/router';

import { MiniBattleComponent } from './mini-battle.component';
import { MiniGameComponent } from './mini-game.component';
import { MiniMatchComponent } from './mini-match.component';
import { MiniPrepComponent } from './mini-prep.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MiniBattleComponent,
        MiniGameComponent,
        MiniMatchComponent,
        MiniPrepComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        DialogModule,
        FormsModule,
        MatInputModule,
    ]
})
export class MiniGameModule { }
