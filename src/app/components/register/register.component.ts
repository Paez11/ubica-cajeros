import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  dni: string;
  password: string;
  account: string;
  email: string;

  showDniInfo: boolean = false;
  showPasswordInfo: boolean = false;
  showAccountInfo: boolean = false;
  showMailInfo: boolean = false;

  showPassWord: boolean = false;

  exist: boolean;
  client: IClient;
  private clientSubscription: Subscription;

  public formRegister: FormGroup;

  constructor(
    private clientS: ClientService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.formRegister = this.fb.group({
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
            '^[a-z0-9A-Z]{0,}[A-Z]{1}[a-z0-9A-Z]{1,}[@]{1}[a-z]{1,}[.]{1}[a-z]{1,}$'
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {}

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

  showInfo(id: string): void {
    const infoField = document.getElementById(id) as HTMLInputElement;
    switch (id) {
      case 'dni':
        this.showDniInfo = !this.showDniInfo;
        break;
      case 'password':
        this.showPasswordInfo = !this.showPasswordInfo;
        break;
      case 'account':
        this.showAccountInfo = !this.showAccountInfo;
        break;
      case 'mail':
        this.showMailInfo = !this.showMailInfo;
        break;
    }
  }

  ngOnDestroy() {
    if (this.clientSubscription) {
      this.clientSubscription.unsubscribe();
    }
  }
}
