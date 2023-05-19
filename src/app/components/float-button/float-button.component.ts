import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-float-button',
  templateUrl: './float-button.component.html',
  styleUrls: ['./float-button.component.scss'],
})
export class FloatButtonComponent {
  showCard: boolean = false;
  showCardLang: boolean = false;

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
  }

  showCardLangMap() {
    this.showCardLang = !this.showCardLang;
  }
}
