import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate:TranslateService) { }

  public set(language:string){
    try {
      this.translate.use(language);
    } catch (error) {
      console.log(error);
    }
  }

  public get():string|null {
    try {
      return this.translate.getBrowserLang();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public getCurrentLanguage():string|null {
    try {
      return this.translate.currentLang;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public getAll(): string[]|null {
    try {
      return this.translate.getLangs();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public add(languages :string[] ){
    this.translate.addLangs(languages);
  }

  public setDefault(language:string) {
    this.translate.setDefaultLang(language);
  }
}
