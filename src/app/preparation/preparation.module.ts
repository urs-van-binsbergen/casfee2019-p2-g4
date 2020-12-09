import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreparationComponent } from './components/preparation.component';
import { PreparationService } from './services/preparation.service';
import { PreparationBoardComponent } from './components/board/preparation-board.component';
import { PreparationInteractionService } from './services/preparation-interaction.service';
import { PreparationYardComponent } from './components/yard/preparation-yard.component';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { PreparationState } from './state/preparation.state';

@NgModule({
    declarations: [
        PreparationComponent,
        PreparationBoardComponent,
        PreparationYardComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
        NgxsModule.forFeature([PreparationState]),
    ],
    providers: [
        PreparationInteractionService,
        PreparationService
    ],
    exports: [
        PreparationComponent
    ]
})
export class PreparationModule { }
