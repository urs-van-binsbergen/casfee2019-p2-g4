import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserComponent } from './user.component';
import { MatCardModule } from '@angular/material';

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FlexLayoutModule,
        MatCardModule,
    ]
})
export class UserModule { }
