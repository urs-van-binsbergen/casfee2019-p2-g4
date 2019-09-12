import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
    declarations: [
        HelloWorldComponent
    ],
    imports: [
        CommonModule,
        MatCardModule
    ]
})
export class HelloWorldModule { }
