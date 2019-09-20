import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatchComponent } from './match.component';
import { MatButtonModule, MatCardModule } from '@angular/material';

@NgModule({
    declarations: [MatchComponent],
    imports: [
        CommonModule,
        TranslateModule,
        MatButtonModule,
        MatCardModule
    ]
})
export class MatchModule { }
