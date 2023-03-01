import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IClient } from 'src/app/model/IClient';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  arr: any[] = []
  
  dniLogin:string
  passwordLogin:string
  emailLogin:string

  name:string
  dni:string
  password:string
  account:string
  email:string

  client:IClient = {
    id: 0,
    name: '',
    account: '',
    dni: '',
    password: ''
  }

  constructor(private clientS:ClientService) {}

  ngOnInit(): void {
    
  }

  public auth():boolean{
    let result:boolean = false
    this.client.dni = this.dniLogin
    this.client.password = this.passwordLogin

    
    
    if(true){
      result = false;
      console.log("Is in database")
      
      //close component and still in map
    }else if(this.client==null){
      console.log("Doesnt exist")
      //open modal register
    }
    return result
  }

  public createAccount(){
    let clientCreated:IClient = {
      id: 0,
      name: this.name,
      account: this.account,
      dni: this.dni,
      password: this.password
    }
    this.clientS.create(clientCreated)
  }

  public sendMail(){
    console.log("Sended")    
  }

  public submit(){
    console.log("Logged")
  }

  public cancel(){
    console.log("Canceled")
  }
}
