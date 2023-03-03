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

  constructor(private clientS: ClientService) { }

  ngOnInit(): void {
    /*this.clientS.getAll().subscribe(client=>{
      console.log(client)
      this.arr.push(...client)
      console.log(this.arr)
    })*/

  }

  public auth() {
    let result: boolean = false
    console.log(this.client)
    this.clientS.getByDni(this.dniLogin).subscribe(client => {
      this.client = client
      console.log(client)
    })

    if (this.client.dni == this.dniLogin && this.client.password == this.passwordLogin) {

      console.log("Is in database")

      //close component and still in map
    } else {
      console.log("Doesnt exist")
      //open modal register
    }

    if(this.client.dni != this.dniLogin || this.client.password != this.passwordLogin){
      
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
        this.clientS.create(this.client.account, this.client.dni, this.client.password, this.client.email).subscribe(client => {
          this.client = client
          console.log(client)
        })
        console.log("Client doesnt exists")
      }
    
    
    /*this.clientS.delete(74).subscribe(client=>{
      this.client = client
      console.log(client)
    })*/
  }

  public sendMail() {
    console.log("Sended")
  }

  public submit() {
    console.log("Logged")
  }

  public cancel() {
    console.log("Canceled")
  }

  showErrorToast() {
    const toastElement = document.getElementById('errorToast')
    //const toast = new Toast(toastElement)
    //toast.show()

  }
}
