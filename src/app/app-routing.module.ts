import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndexComponent } from './index.component';
import { LoginComponent } from './auth/login.component';
import { HallComponent } from './hall/hall.component';
import { PreparationComponent } from './preparation/preparation.component';
import { AuthGuard } from './auth/auth.guard';
import { PreparationGuard } from './preparation/preparation.guard';

const routes: Routes = [
    { path: '', component: HallComponent },
    { path: 'hall', component: HallComponent },
    { path: 'index', component: IndexComponent },
    { path: 'hello-world', component: HelloWorldComponent },
    { path: 'login', component: LoginComponent },
    { path: 'preparation', component: PreparationComponent, canActivate: [AuthGuard], canDeactivate: [PreparationGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
