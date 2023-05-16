import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SHA256 } from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, retry } from 'rxjs';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';

declare var bootstrap: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('rModal') rModal: ElementRef;
  _rModal;
  showModal: boolean;
  showPassWord: boolean = false;
  exist: boolean;

  isValid: boolean = true;
  isValidUser: boolean = true;
  isValidPassword: boolean = true;

  noValid: string = '';

  showSpinner: boolean = false;

  public form: FormGroup;
  public formRegister: FormGroup;

  dniLogin: string;
  passwordLogin: string;

  name: string;
  dni: string;
  password: string;
  account: string;
  email: string;

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

    this.formRegister = this.fb.group({
      name: ['', [Validators.required]],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern('^[0-9]{8}[A-Z]{1}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^([a-z0-9A-Z]*[-_.,ºª*+-Ç]*)*$'),
        ],
      ],
      account: [
        '',
        [
          Validators.required,
          Validators.minLength(29),
          Validators.maxLength(29),
          Validators.pattern(
            '^ES[0-9]{2} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$'
          ),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-z0-9A-Z]{0,}[A-Z]{1}[a-z0-9A-Z]{1,}[@]{1}[a-z]{1,}.[a-z]{1,}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this._rModal = new bootstrap.Modal(
      document.getElementById('registerModal'),
      {}
    );
  }

  auth() {
    if (this.form.value.dniLogin && this.form.value.passwordLogin) {
      this.clientSubscription = this.clientS
        .getByDni(this.form.value.dniLogin)
        .pipe
        //retry(10)
        ()
        .subscribe(
          (client) => {
            /* try { */
            if (
              this.form.value.dniLogin == client.dni &&
              this.hash(this.form.value.passwordLogin) == client.password
            ) {
              this.isValidPassword = true
              this.isValidUser = true
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
            /* } catch (Error) {
              this.toastr.error(
                this.translate.instant('validUser'),
                this.translate.instant('errorVerificate')
              );
            }
          }, */
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

  createAccount() {
    if (
      this.formRegister.value.dni &&
      this.formRegister.value.password &&
      this.formRegister.value.account &&
      this.formRegister.value.email
    ) {
      try {
        this.client = {
          dni: this.formRegister.value.dni,
          password: this.formRegister.value.password,
          account: this.formRegister.value.account,
          email: this.formRegister.value.email,
        };
        this.clientS.getByDni(this.client.dni).subscribe((client) => {
          try {
            if (client.dni) {
              this.exist = true;
            }
          } catch (error) {
            this.toastr.info(
              this.translate.instant('userNotExists'),
              this.translate.instant('notExist')
            );
          }
        });

        if (this.exist) {
          this.formRegister.reset();
          this.close(this._rModal);
          this.toastr.error(
            this.translate.instant('userNotCreated'),
            this.translate.instant('notCreate')
          );
        } else {
          this.formRegister.reset();
          this.clientSubscription = this.clientS
            .create(
              this.client.account,
              this.client.dni,
              this.client.password,
              this.client.email
            )
            .subscribe((client) => {
              this.client = client;
              this.clientS.setUser(this.client);
              this.close(this._rModal);
              this.toastr.success(
                this.translate.instant('userCreated'),
                this.translate.instant('create')
              );
            });
        }
      } catch (Error) {
        this.toastr.error('Error');
      }
    } else {
      this.toastr.error(
        this.translate.instant('enterData'),
        this.translate.instant('notCreate')
      );
    }
  }

  close(modal: any) {
    modal.hide();
    this.showModal = false;
    this.isValid = true;
  }
  open(modal: any) {
    modal.show();
    this.showModal = true;
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

  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }
}
