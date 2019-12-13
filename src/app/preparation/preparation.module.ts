import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreparationComponent } from './components/preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationBoardComponent } from './components/preparation-board.component';
import { PreparationInteractionService } from './preparation-interaction.service';
import { PreparationYardComponent } from './components/preparation-yard.component';
import { PreparationGuard } from './preparation.guard';
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
