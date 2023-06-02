import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, fromEvent } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';
import { LanguageService } from 'src/app/services/language.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  cashierList: ICashier[];
  showCard: boolean = false;
  slider: boolean = false;
  user: IClient;
  showAdmin: boolean = false;

  clickOut$ = fromEvent<PointerEvent>(document, 'click');
  subscription: Subscription;

  constructor(private _langService: LanguageService, 
              private _clientService: ClientService,
              private _toastrService: ToastrService,
              private _translate: TranslateService,
              private _mapService: MapService ) { }

  ngAfterViewInit(): void {
    this._mapService.cashiersList$.subscribe( (data) => {
      this.cashierList = data;
    });
  }

  ngOnInit(): void {
    if(this._clientService.user.admin) {
      this.showAdmin = true;
      this._toastrService.info(this._translate.instant("adminMode"));
    }
  }

  sliderbtn() {
    if (this._langService.getCurrentLanguage() == 'es') {
      this.slider = false;
    } else {
      this.slider = true;
    }
  }

  setLang() {
    if (this._langService.getCurrentLanguage() != 'es') {
      this._langService.set('es');
    } else if (this._langService.getCurrentLanguage() != 'en') {
      this._langService.set('en');
    }
  }

  resetLanguage() {
    const lang = this._langService.get();
    this._langService.set(lang);
  }

  showCardMap() {
    this.sliderbtn();
    this.showCard = !this.showCard;
    if (this.showCard) {
      this.subscription = this.clickOut$.subscribe((event) => {
        if (event.target['className'] !== 'img') {
          if (event.target['className'] === 'mat-slide-toggle-thumb') {
            this.showCard = true;
          } else {
            this.showCard = false;
            this.subscription.unsubscribe();
          }
        }
      });
    }
  }
}
