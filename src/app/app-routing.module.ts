
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { LoginComponent } from './components/login/login.component';
import { QrComponent } from './components/qr/qr.component';
import { ContainerComponent } from './components/container/container.component';
import { LoginGuard } from './guards/login.guard';
import { MapGuard } from './guards/map.guard';
import { RegisterComponent } from './components/register/register.component';
import { RestablishPasswordComponent } from './components/restablish-password/restablish-password.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'restablishPassword', component:RestablishPasswordComponent},
  {path:'main', canActivate: [LoginGuard], component:ContainerComponent},
  {path:'QR', canActivate: [LoginGuard, MapGuard], component:QrComponent},
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'**', component:Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
