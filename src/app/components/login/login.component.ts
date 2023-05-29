import { error } from 'jquery';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SHA256 } from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';
import { Subscription, map, catchError, fromEvent, take } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassWord: boolean = false;
  showLang: boolean = false;
  slider: boolean = false;

  isValidUser: boolean = true;
  isValidPassword: boolean = true;

  noValidUser: string = '';
  noValidPassword: string = '';

  showSpinner: boolean = false;

  public form: FormGroup;

  dniLogin: string;
  passwordLogin: string;

  client: IClient = {
    account: '',
    dni: '',
    password: '',
  };
  private clientSubscription$: Subscription;
  private subscription: Subscription;

  clickOut$ = fromEvent(document, 'click');

  constructor(
    private _clientS: ClientService,
    private router: Router,
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _translate: TranslateService,
    private _langService: LanguageService
  ) {
    this.form = this.fb.group({
      dniLogin: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern('^[0-9]{8}[A-Z]{1}$'),
        ],
      ],
      passwordLogin: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^([a-z0-9A-Z]*[-_.,ºª*+-Ç]*)*$'),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  auth() {
    if (this.form.value.dniLogin && this.form.value.passwordLogin) {
      this.clientSubscription$ = this._clientS
        .getByDni(this.form.value.dniLogin)
        .subscribe(
          (client) => {
            if (client) {
              if (
                this.form.value.dniLogin === client.dni &&
                this.hash(this.form.value.passwordLogin) === client.password
              ) {
                this.isValidPassword = true;
                this.isValidUser = true;
                this.showSpinner = true;
                let auxClient = {
                  id: client.id,
                  dni: client.dni,
                  account: client.account,
                  email: client.email,
                  password: client.password,
                };
                this.client = auxClient;
                this._clientS.setUser(this.client);
                this._toastr.success(
                  this._translate.instant('userVerified'),
                  this._translate.instant('verificate'),
                  { timeOut: 1500 }
                );
                setTimeout(() => {
                  this.showSpinner = false;
                  this.router.navigate(['/main']);
                }, 2000);
                this.form.reset();
                this.showPassWord = false;
              } else if (this.form.value.passwordLogin != client.password) {
                this.isValidPassword = false;
                this.noValidPassword = this._translate.instant('validPassword');
                if (this.form.value.dniLogin == client.dni) {
                  this.isValidUser = true;
                }
              }
            } else {
              this.isValidUser = false;
              this.noValidUser = this._translate.instant('validUser');
              if (this.form.value.passwordLogin) {
                this.isValidPassword = false;
                this.noValidPassword = this._translate.instant(
                  'validNoUserPassword'
                );
              }
            }
          },
          (error: HttpErrorResponse) => {
            this._toastr.error(
              this._translate.instant('errorServer'),
              this._translate.instant('error')
            );
          }
        );
    } else if (!this.form.value.dniLogin && !this.form.value.passwordLogin) {
      this._toastr.error(
        this._translate.instant('enterData'),
        this._translate.instant('errorVerificate')
      );
    }
  }

  hash(string) {
    return SHA256(string).toString();
  }

  showPassword(id: string): void {
    const passwordField = document.getElementById(id) as HTMLInputElement;
    if (passwordField.type === 'password') {
      this.showPassWord = true;
      passwordField.type = 'text';
    } else {
      this.showPassWord = false;
      passwordField.type = 'password';
    }
  }

  autoLogin(): IClient {
    let userData = localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null;
    if (!userData) {
      this.client = userData;
    }
    return this.client;
  }

  sliderbtn() {
    if (this._langService.getCurrentLanguage() == 'es') {
      this.slider = false;
    } else {
      this.slider = true;
    }
  }

  showLangLogin() {
    this.sliderbtn();
    this.showLang = !this.showLang;
    if (this.showLang) {
      this.subscription = this.clickOut$.pipe(take(3)).subscribe((event) => {
        console.log(event)
        if (event.target['className'] !== 'btn btnLang') {
          if (event.target['className'] === 'mat-slide-toggle-thumb') {
            this.showLang = true;
          } else {
            this.showLang = false;
          }
        }
      });
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
}
