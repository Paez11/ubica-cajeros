import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('modal') modal:ElementRef;
  _modal;
  show:boolean;

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

  client: IClient = {
    id: 0,
    dni: '',
    password: '',
    email: '',
    account: ''
  }

  private clientSubscription:Subscription;

  constructor(private clientS: ClientService,private router:Router) { }

  ngOnInit(): void {

  }

  public auth() {
    this.clientSubscription = this.clientS.getByDni(this.dniLogin).subscribe(client => {
      this.client = client
    })

    if (this.client.dni == this.dniLogin && this.client.password == this.passwordLogin) {
      this.clientS.setUser(this.client);
      this.router.navigate(['/main']);
    } else {
      this.open();
    }
  }

  public createAccount() {
    this.client = {
      dni: this.dni,
      password: this.password,
      account: this.account,
      email: this.email,
    }
    
    if (this.clientS.getByDni(this.client.dni).subscribe(client=>{this.client=client})) {
      console.log("Client exists")
    }else{
      this.clientSubscription = this.clientS.create(this.client.account, this.client.dni, this.client.password, this.client.email).subscribe(client => {
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

  ngOnDestroy(){
    if(this.clientSubscription){
      this.clientSubscription.unsubscribe();
    }
  }
}
