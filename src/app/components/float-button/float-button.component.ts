import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, fromEvent, map, take } from 'rxjs';
import { ClientService } from 'src/app/services/client.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss'],
})
export class FloatButtonComponent implements OnInit {
  showCard: boolean = false;
  showCardLang: boolean = false;
  slider: boolean = false;
  showAdmin: string = 'display: none;';

  clickOut$ = fromEvent<PointerEvent>(document, 'click');
  subscription: Subscription;

  constructor(private _langService: LanguageService,
              private _clientService: ClientService,
              private _toastrService: ToastrService,
              private _translate: TranslateService ) {}

  ngOnInit(): void {
    if(this._clientService.user.admin) {
      this.showAdmin = 'display: block;';
    }
  }

  setLang() {
    if (this._langService.getCurrentLanguage() != 'es') {
      this._langService.set('es');
    } else if (this._langService.getCurrentLanguage() != 'en') {
      this._langService.set('en');
    }
  }

  showCardMap() {
    this.sliderbtn();
    this.showCard = !this.showCard;
    if (this.showCard) {
      this.subscription = this.clickOut$.pipe(take(3)).subscribe((event) => {
        if (event.target['className'] !== 'btn-flotante') {
          if (event.target['className'] !== 'btn') {
            if (event.target['id'] !== 'biHouse') {
              if (event.target['className'] === 'mat-slide-toggle-thumb') {
                this.showCardLang = true;
                if (this.showCardLang) {
                  this.showCard = false;
                }
              } else {
                this.showCard = false;
                this.showCardLang = false;
                this.clickUnsubscribe();
              }
            }
          }
        }
      });
    }
  }

  showCardLangMap() {
    this.showCardLang = !this.showCardLang;
  }

  clickUnsubscribe() {
    if (!this.showCard && !this.showCardLang) {
      this.subscription.unsubscribe();
    }
  }

  sliderbtn() {
    if (this._langService.getCurrentLanguage() === 'es') {
      this.slider = false;
    } else {
      this.slider = true;
    }
  }

  resetLanguage() {
    const lang = this._langService.get();
    this._langService.set(lang);
  }
}
