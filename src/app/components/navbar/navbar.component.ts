import { Component, Input, OnInit } from '@angular/core';
import { Subscription, fromEvent, map } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() cashierList: ICashier[];
  showCard: boolean = false;
  slider: boolean = false;
  user: IClient;
  showAdmin: string = 'display: none;';

  clickOut$ = fromEvent<PointerEvent>(document, 'click');
  subscription: Subscription;

  constructor(private _langService: LanguageService, private _clientService: ClientService) {}

  ngOnInit(): void {
    if(this._clientService.user.admin) this.showAdmin = 'display: block;'
    console.log(this._clientService.user)
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
