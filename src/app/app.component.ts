import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ubica-cajeros-frontend';
  langs: string[];

  constructor(private _langService: LanguageService){
    let language=this._langService.get();
    this._langService.set(language);
    this._langService.add(['es','en']);
    if(language) {
      this._langService.setDefault(language);
    }
    else {
      this._langService.setDefault('es');
    }
    this.langs = _langService.getAll();
  } 
}