import { NgModule } from '@angular/core';
import { UserComponent } from './components/user.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [UserComponent],
    imports: [
        SharedModule,
        AppRoutingModule
    ]
})
export class UserModule { }
