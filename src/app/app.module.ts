import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { DetailsComponent } from './components/details/details.component';
import { ContainerComponent } from './components/container/container.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';
import { RadioSliderComponent } from './components/radio-slider/radio-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LoginComponent } from './components/login/login.component';
import { ModalTransactionComponent } from './components/modal-transaction/modal-transaction.component';

//searchbar
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { CashierService } from './services/cashier.service';
import { ClientService } from './services/client.service';
import { MapService } from './services/map.service';
import { QrComponent } from './components/qr/qr.component';
import { Error404Component } from './components/error404/error404.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ModalTService } from './services/modal-t.service';

import { NavbarComponent } from './components/navbar/navbar.component';

import {ToastrModule} from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

import { FloatButtonComponent } from './components/float-button/float-button.component';

import { MatMenuModule } from '@angular/material/menu';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SearchbarComponent,
    DetailsComponent,
    ContainerComponent,
    RadioSliderComponent,
    LoginComponent,
    ModalTransactionComponent,
    QrComponent,
    Error404Component,
    NavbarComponent,
    RegisterComponent,
    SpinnerComponent,
    FloatButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
    }
    }),
    BrowserAnimationsModule,
    MatCardModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    QRCodeModule,
    ToastrModule.forRoot({
      positionClass:'toastr-center'
    }),
    MatMenuModule
  ],
  providers: [CashierService,ClientService,SearchbarComponent,MapService,ModalTService],
  bootstrap: [AppComponent]
})
export class AppModule { }
