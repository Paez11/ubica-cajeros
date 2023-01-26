import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ubica-cajeros-frontend';
  langs: string[];

  constructor(translate: TranslateService){
        //the lang it will be detected in the browser
        translate.use(navigator.language);
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.addLangs(['en-EN','es-ES']);
        if(localStorage.getItem('language')){
          translate.setDefaultLang(localStorage.getItem('language')!);
          translate.use(localStorage.getItem('language')!);
        }else{
          // this language will be used as a fallback when a translation isn't found in the current language
          translate.setDefaultLang('en-EN');
        }
        this.langs = translate.getLangs();
  }
  
}
