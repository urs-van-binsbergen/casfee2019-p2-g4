import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndexComponent } from './index.component';
import { HallComponent } from './hall/hall.component';
import { PreparationComponent } from './preparation/preparation.component';

const routes: Routes = [
  { path: '', component: HallComponent },
  { path: 'index', component: IndexComponent },
  { path: 'hello-world', component: HelloWorldComponent },
  { path: 'hall', component: HallComponent },
  { path: 'preparation', component: PreparationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
