import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleComponent } from './battle.component';
import { MatCardModule, MatButtonModule } from '@angular/material';



@NgModule({
  declarations: [BattleComponent],
  imports: [
    CommonModule, 
    MatCardModule,
    MatButtonModule
]
})
export class BattleModule { }
