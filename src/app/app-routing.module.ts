import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { LoginComponent } from './components/login/login.component';
import { QrComponent } from './components/qr/qr.component';
import { LoginGuard } from './guards/login.guard';
import { MapGuard } from './guards/map.guard';
import { RegisterComponent } from './components/register/register.component';
import { RestablishPasswordComponent } from './components/restablish-password/restablish-password.component';
import { BlankPageComponent } from './components/blank-page/blank-page.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'main', component:NavbarComponent, children: [
    { path: 'map', canActivate: [LoginGuard], component: MapComponent },
    { path: 'restablishPassword', component: RestablishPasswordComponent },
    { path: 'QR', canActivate: [LoginGuard, MapGuard], component: QrComponent },
    { path: 'accounts', canActivate: [LoginGuard], component: BlankPageComponent },
    { path: 'cards', canActivate: [LoginGuard], component: BlankPageComponent },
    { path: 'transfers', canActivate: [LoginGuard], component: BlankPageComponent },
    { path: 'deposits', canActivate: [LoginGuard], component: BlankPageComponent },
    { path: 'admin', canActivate: [LoginGuard], component: AdminPanelComponent },
  ]},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
