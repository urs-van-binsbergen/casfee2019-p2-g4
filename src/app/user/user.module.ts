import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { MatCardModule } from '@angular/material';

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        MatCardModule,
    ]
})
export class UserModule { }
