import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { Subscription, tap } from 'rxjs';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';

declare var bootstrap:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('eModal') eModal:ElementRef;
  _eModal;

  @ViewChild('rModal') rModal:ElementRef;
  _rModal;
  show:boolean;

  _toast:any;
  _sToast:any;
  exist:boolean;
  
  isValid: boolean = true;

  public form:FormGroup;
  public formRegister:FormGroup;

  arr: any[] = []

  dniLogin: string
  passwordLogin: string
  emailLogin: string

  name: string
  dni: string
  password: string
  account: string
  email: string

  client: IClient;

  private clientSubscription:Subscription;

  constructor(private clientS: ClientService,private router:Router,private fb:FormBuilder) { 
    this.form = this.fb.group({
      dniLogin: ['',[Validators.required,Validators.minLength(8)]],
      passwordLogin:['',[Validators.required,Validators.minLength(4)]]
    })

    this.formRegister = this.fb.group({
      dni: ['',[Validators.required,Validators.minLength(8)]],
      password:['',[Validators.required,Validators.minLength(4)]],
      account:[''],
      email:['']
    })
  }

  ngOnInit(): void {
    this._eModal = new bootstrap.Modal(document.getElementById("emailModal"),{});
    this._rModal = new bootstrap.Modal(document.getElementById("registerModal"),{});
    this._toast = new bootstrap.Toast(document.getElementById('WrongToast'),{});
    this._sToast = new bootstrap.Toast(document.getElementById('successToast'),{});
  }

  auth() {
    this.clientSubscription = this.clientS.getByDni(this.form.value.dniLogin).subscribe(client => {
      try{
        if(this.form.value.dniLogin == client.dni && this.hash(this.form.value.passwordLogin) == client.password){
          let auxClient = {
            id:client.id,
            dni:client.dni,
            account:client.account,
            email:client.email,
            password:client.password
          }
          this.client=auxClient;
          this.clientS.setUser(this.client);
          this.router.navigate(['/main']);
        }
      }catch(error){
        this._toast.show();
      }
    });
  }

  createAccount() {
    this.client = {
      dni: this.formRegister.value.dni,
      password: this.formRegister.value.password,
      account: this.formRegister.value.account,
      email: this.formRegister.value.email,
    }
    this.clientS.getByDni(this.client.dni).subscribe(client=>{
      try{
        if(client.dni){
          this.exist=true;
        }
      }catch(error){
        console.info("client not found");
      }
    });

    if (this.exist) {
      //toast
      this._toast.show();
    }else{
      this.clientSubscription = this.clientS.create(this.client.account, this.client.dni, this.client.password, this.client.email).subscribe(client => {
        try{
          this.client = client;
          this.clientS.setUser(this.client);
          this.close(this._rModal);
        }catch(error){
          console.error("conexion error")
        }
      });
      //toast
      this._sToast.show();
    }
  }

  close(modal:any){
    modal.hide();
    this.show=false;
    this.isValid = true;
  }
  open(modal:any){
    modal.show();
    this.show=true;
  }

  sendMail(emailLogin) {
    //Send email
    if(!emailLogin){
      this.isValid = false;
    }else{
      this.close(this._eModal);
    }
  }

  hash(string) {
    return SHA256(string).toString();
  }

  showPassword(id:string): void {
    const passwordField = document.getElementById(id) as HTMLInputElement;
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
    } else {
      passwordField.type = 'password';
    }
  }

  autoLogin():IClient{
    let userData = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!) : null;
    if(!userData){
      this.client = userData;
    }
    return  this.client;
  }

  ngOnDestroy(){
    if(this.clientSubscription){
      this.clientSubscription.unsubscribe();
    }
  }
}
