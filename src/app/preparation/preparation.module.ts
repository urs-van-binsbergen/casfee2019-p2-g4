import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreparationComponent } from './components/preparation.component';
import { PreparationService } from './services/preparation.service';
import { PreparationBoardComponent } from './components/board/preparation-board.component';
import { PreparationInteractionService } from './services/preparation-interaction.service';
import { PreparationYardComponent } from './components/yard/preparation-yard.component';
import { PreparationGuard } from './guards/preparation.guard';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        PreparationComponent,
        PreparationBoardComponent,
        PreparationYardComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    providers: [
        PreparationGuard,
        PreparationInteractionService,
        PreparationService
    ],
    exports: [
        PreparationComponent
    ]
})
export class PreparationModule { }
