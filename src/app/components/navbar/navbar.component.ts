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

  click$ = fromEvent<PointerEvent>(document, 'click');

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
    /* this.click$
      .pipe(
        map((event) => {
            if (
              event.currentTarget['className'] !== 'divLang' ||
              'imgLang' ||
              'row' ||
              'btn' ||
              'col' ||
              'card-body' ||
              'card'
            ) {
              this.showCard = false;
            } else if (event.currentTarget['className'] === 'navbar-brand') {
              this.showCard = true;
            }
          
        })
      )
      .subscribe(); */
  }
}
