import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CloudFunctionsService } from './cloud-functions.service';
import { CloudDataService } from './cloud-data.service';

@NgModule({
    declarations: [
    ],
    imports: [
        SharedModule,
    ],
    providers: [
        CloudFunctionsService,
        CloudDataService,
    ]
})
export class BackendModule {
}
