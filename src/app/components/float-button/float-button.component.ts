import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss'],
})
export class FloatButtonComponent {
  showCard: boolean = false;
  showCardLang: boolean = false;

  clickOut$ = fromEvent<PointerEvent>(document, 'click');

  constructor(private _langService: LanguageService) {}

  setLang() {
    if (this._langService.getCurrentLanguage() != 'es') {
      this._langService.set('es');
    } else if (this._langService.getCurrentLanguage() != 'en') {
      this._langService.set('en');
    }
  }

  showCardMap() {
    this.showCard = !this.showCard;
    if (this.showCard) {
      this.showCardLang = false;
      this.clickOut$.subscribe((event) => {
        console.log(event);
        if (event.target['className'] !== 'btn-flotante') {
          if (event.target['className'] !== 'btn') {
            if (event.target['id'] !== 'biHouse') {
              this.showCard = false;
              this.showCardLang = false;
            }
          }
        }
      });
    }
  }

  showCardLangMap() {
    this.showCardLang = !this.showCardLang;
  }
}
