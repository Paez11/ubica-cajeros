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

    const toastTrigger = document.getElementById('ToastBtnWrong')
    const toastLive= document.getElementById('WrongToast')
  }

  ngOnInit(): void {
    this._eModal = new bootstrap.Modal(document.getElementById("emailModal"),{});
    this._rModal = new bootstrap.Modal(document.getElementById("registerModal"),{});
  }

  auth() {
    this.clientSubscription = this.clientS.getByDni(this.form.value.dniLogin).subscribe(client => {
      if(this.form.value.dniLogin != client.dni || this.hash(this.form.value.passwordLogin) != client.password){
        const toastTrigger = document.getElementById('ToastBtnWrong')
        const toastLive= document.getElementById('WrongToast')
        if (toastTrigger) {
          toastTrigger.addEventListener('click', () => {
            const toast = new bootstrap.Toast(toastLive)
            toast.show()
          })
        }
      }else{
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
      if(client.dni){
        this.exist=true;
      }
    });

    if (this.exist) {
      //toast
      console.log("Client exists")
    }else{
      this.clientSubscription = this.clientS.create(this.client.account, this.client.dni, this.client.password, this.client.email).subscribe(client => {
        this.client = client;
        this.clientS.setUser(this.client);
        this.close(this._rModal);
      });
      //toast
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
