import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SHA256 } from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';
import { Subscription } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassWord: boolean = false;

  isValidUser: boolean = true;
  isValidPassword: boolean = true;

  noValid: string = '';

  showSpinner: boolean = false;

  public form: FormGroup;

  dniLogin: string;
  passwordLogin: string;

  client: IClient;
  private clientSubscription: Subscription;

  constructor(
    private clientS: ClientService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
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
      this.clientSubscription = this.clientS
        .getByDni(this.form.value.dniLogin)
        .pipe()
        .subscribe(
          (client) => {
            if (
              this.form.value.dniLogin == client.dni &&
              this.hash(this.form.value.passwordLogin) == client.password
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
              this.clientS.setUser(this.client);
              this.toastr.success(
                this.translate.instant('userVerified'),
                this.translate.instant('verificate'),
                { timeOut: 1500 }
              );
              setTimeout(() => {
                this.showSpinner = false;
                this.router.navigate(['/main']);
              }, 2000);
              this.form.reset();
              this.showPassWord = false;
            } else if (
              this.form.value.dniLogin != client.dni ||
              this.form.value.passwordLogin != client.password
            ) {
              if (this.form.value.dniLogin != client.dni) {
                this.isValidUser = false;
                this.noValid = this.translate.instant('validUser');
              } else if (this.form.value.passwordLogin != client.password) {
                this.isValidPassword = false;
                this.noValid = this.translate.instant('validPassword');
              }
            }
            //En vez de toasts de error, un mensaje que salga debajo de los campos incorrectos
            /* else if (this.form.value.passwordLogin !== this.passwordLogin) {
                this.toastr.error(
                  this.translate.instant('validPassword'),
                  this.translate.instant('errorVerificate')
                );
              } else if (
                this.form.value.dniLogin !== this.dniLogin &&
                this.form.value.passwordLogin !== this.passwordLogin
              ) {
                this.toastr.error(
                  this.translate.instant('validData'),
                  this.translate.instant('errorVerificate')
                );
              } */
          },
          (error: HttpErrorResponse) => {
            this.toastr.error(
              this.translate.instant('errorServer'),
              this.translate.instant('error')
            );
          }
        ); //En vez de toasts de error, un mensaje que salga debajo de los campos incorrectos
      /* } else if (!this.form.value.dniLogin && !this.form.value.passwordLogin) {
      this.toastr.error(
        this.translate.instant('enterData'),
        this.translate.instant('errorVerificate')
      );
    } else if (!this.form.value.dniLogin) {
      this.toastr.error(
        this.translate.instant('enterUser'),
        this.translate.instant('errorVerificate')
      );
    } else if (!this.form.value.passwordLogin) {
      this.toastr.error(
        this.translate.instant('enterPassword'),
        this.translate.instant('errorVerificate')
      ); */
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
}
