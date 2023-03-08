import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { Subscription, tap } from 'rxjs';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('registerModal') modal:ElementRef;
  _modal;
  show:boolean;
  exist:boolean;

  arr: any[] = []

  dniLogin: string
  passwordLogin: string
  emailLogin: string

  name: string
  dni: string
  password: string
  account: string
  email: string

  toast:string

  client: IClient;

  private clientSubscription:Subscription;

  constructor(private clientS: ClientService,private router:Router) { }

  ngOnInit(): void {

  }

  public auth() {
    console.log(this.dniLogin)
    this.clientSubscription = this.clientS.getByDni(this.dniLogin).subscribe(client => {
      console.log("ENTRA -->",client)
      let auxClient = {
        id:client.id,
        dni:client.dni,
        account:client.account,
        email:client.email,
        password:client.password
      }
      console.log("MIRA -->",auxClient)
      this.client=auxClient;
      console.log(this.passwordLogin=this.hash(this.passwordLogin))
      if (this.client.dni == this.dniLogin && this.client.password == (this.passwordLogin=this.hash(this.passwordLogin))) {
        console.log("LOGEA")
        this.clientS.setUser(this.client);
        this.router.navigate(['/main']);
      }
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
      })
    }
  }

  close(){
    this._modal.hide();
    this.show=false;
  }
  open(){
    this._modal.show();
    this.show=true;
  }

  public sendMail() {
    //Send email
  }

  public submit() {
    
  }

  public cancel() {
    
  }

  showErrorToast() {
    const toastElement = document.getElementById('errorToast')
    //const toast = new Toast(toastElement)
    //toast.show()

  }

  hash(string) {
    return SHA256(string).toString();
  }
  

  ngOnDestroy(){
    if(this.clientSubscription){
      this.clientSubscription.unsubscribe();
    }
  }
}
