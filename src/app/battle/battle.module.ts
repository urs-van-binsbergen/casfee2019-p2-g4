import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BattleComponent } from './battle.component';
import { MatCardModule, MatButtonModule } from '@angular/material';

@NgModule({
    declarations: [BattleComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule
    ]
})
export class BattleModule { }
