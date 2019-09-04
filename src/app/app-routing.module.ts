import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndexComponent } from './index.component';

const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'hello-world', component: HelloWorldComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
