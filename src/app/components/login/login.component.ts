import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { IndividualConfig, ToastrConfig, ToastrService } from 'ngx-toastr';
import { Subscription, map, tap, timeout } from 'rxjs';
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
  show: boolean;
  showPassWord: boolean = false;

  _toast: any;
  _sToast: any;
  exist: boolean;

  isValid: boolean = true;

  public form: FormGroup;
  public formRegister: FormGroup;

  arr: any[] = [];

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
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      dniLogin: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      passwordLogin: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.formRegister = this.fb.group({
      name: ['', [Validators.required]],
      dni: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
      account: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._rModal = new bootstrap.Modal(
      document.getElementById('registerModal'),
      {}
    );
  }

  auth() {
    this.clientSubscription = this.clientS
      .getByDni(this.form.value.dniLogin)
      .subscribe((client) => {
        try {
          if (
            this.form.value.dniLogin == client.dni &&
            this.hash(this.form.value.passwordLogin) == client.password
          ) {
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
              'El usuario ha sido verificado correctamente.',
              'Usuario verificado'
            );
            //this.toastr.info('Redireccionando al mapa','Redireccionando')
            setTimeout(() => {
              this.router.navigate(['/main']);
            }, 5000);
          }
        } catch (error) {
          this.toastr.error(
            'El usuario introducido no existe',
            'Error al verificar el usuario'
          );
          this.form.reset();
          //toast
        }
      });
  }

  createAccount() {
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
        console.info('client not found');
      }
    });

    if (this.exist) {
      //toast
    } else {
      this.clientSubscription = this.clientS
        .create(
          this.client.account,
          this.client.dni,
          this.client.password,
          this.client.email
        )
        .subscribe((client) => {
          try {
            this.client = client;
            this.clientS.setUser(this.client);
            this.close(this._rModal);
          } catch (error) {
            console.error('conexion error');
          }
        });
      //toast
    }
  }

  close(modal: any) {
    modal.hide();
    this.show = false;
    this.isValid = true;
  }
  open(modal: any) {
    modal.show();
    this.show = true;
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
