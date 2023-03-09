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
  }

  ngOnInit(): void {
    this._eModal = new bootstrap.Modal(document.getElementById("emailModal"),{  });
    this._rModal = new bootstrap.Modal(document.getElementById("registerModal"),{});
  }

  public auth() {
    this.clientSubscription = this.clientS.getByDni(this.form.value.dniLogin).subscribe(client => {
      if(this.form.value.dniLogin != client.dni || client.password != (this.form.value.passwordLogin=this.hash(this.passwordLogin))){
        const toastTrigger = document.getElementById('ToastBtnWrong')
        const toastLive = document.getElementById('WrongToast')
        toastTrigger.addEventListener('click', () => {
          const toast = new bootstrap.Toast(toastLive)
          toast.show()
        })
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
        localStorage.setItem('currentUser', JSON.stringify({user:this.client}));
        this.router.navigate(['/main']);
      }
      /*
      let auxClient = {
        id:client.id,
        dni:client.dni,
        account:client.account,
        email:client.email,
        password:client.password
      }
      this.client=auxClient;
      if (this.client.dni == this.form.value.dniLogin && this.client.password == (this.form.value.passwordLogin=this.hash(this.passwordLogin))) {
        this.clientS.setUser(this.client);
        this.router.navigate(['/main']);
      }else{
        const toastTrigger = document.getElementById('ToastBtnWrong')
        const toastLive = document.getElementById('WrongToast')
        toastTrigger.addEventListener('click', () => {
          const toast = new bootstrap.Toast(toastLive)
          toast.show()
        })
      }
      */
    });
  }

  public createAccount() {
    this.client = {
      dni: this.dni,
      password: this.password,
      account: this.account,
      email: this.email,
    }
    
    this.clientS.getByDni(this.client.dni).subscribe(client=>{
      if(client.dni){
        this.exist=true;
      }else{

      }
    })

    if (this.exist) {
      console.log("Client exists")
    }else{
      this.clientSubscription = this.clientS.create(this.client.account, this.client.dni, this.hash(this.client.password), this.client.email).subscribe(client => {
        this.client = client
        this.clientS.setUser(this.client);
        this.close(this._rModal);
      })
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
