import { Component, Input, OnInit } from '@angular/core';
import { ICashier } from 'src/app/model/ICashier';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
@Input() cashierList: ICashier[];

  constructor(private _langService: LanguageService) { }

  ngOnInit(): void {
  }

  setLang(lang: string) {
    this._langService.set(lang);
  }
}
