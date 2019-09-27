import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreparationComponent } from './preparation.component';
import { PreparationService } from './preparation.service';
import { PreparationGuard } from './preparation.guard';

@NgModule({
    declarations: [
        PreparationComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
        PreparationService,
        PreparationGuard
    ]
})
export class PreparationModule { }
