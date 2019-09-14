import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchComponent } from './match.component';
import { MatButtonModule, MatCardModule } from '@angular/material';



@NgModule({
    declarations: [MatchComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule
    ]
})
export class MatchModule { }
