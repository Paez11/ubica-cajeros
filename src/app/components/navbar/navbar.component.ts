import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { ICashier } from 'src/app/model/ICashier';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() cashierList: ICashier[];
  showCard: boolean = false;

  clickOut$ = fromEvent<PointerEvent>(document, 'click');

  constructor(private _langService: LanguageService) {}

  ngOnInit(): void {}

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
      this.clickOut$.subscribe((event) => {
        console.log(event);
        if (event.target['className'] !== 'img') {
              this.showCard = false;
        }
      });
    }
  }
}
