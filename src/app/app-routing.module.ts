import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndexComponent } from './index.component';
import { LoginComponent } from './login/login.component';
import { HallComponent } from './hall/hall.component';
import { PreparationComponent } from './preparation/preparation.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: HallComponent },
    { path: 'index', component: IndexComponent },
    { path: 'hello-world', component: HelloWorldComponent },
    { path: 'login', component: LoginComponent },
    { path: 'hall', component: HallComponent },
    { path: 'preparation', component: PreparationComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
